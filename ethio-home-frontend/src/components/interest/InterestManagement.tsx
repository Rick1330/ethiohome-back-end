import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InterestForm } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Filter,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Eye,
  Reply,
  Archive,
  Star
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface InterestManagementProps {
  interests: InterestForm[];
  onReply: (interestId: string, message: string) => void;
  onMarkAsRead: (interestId: string) => void;
  onArchive: (interestId: string) => void;
  isLoading?: boolean;
}

export const InterestManagement: React.FC<InterestManagementProps> = ({
  interests,
  onReply,
  onMarkAsRead,
  onArchive,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedInterest, setSelectedInterest] = useState<InterestForm | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const filteredInterests = interests.filter(interest => {
    const matchesSearch = 
      interest.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interest.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interest.property?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || interest.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || interest.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'not_interested':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReply = async () => {
    if (!selectedInterest || !replyMessage.trim()) return;

    setIsReplying(true);
    try {
      await onReply(selectedInterest.id, replyMessage);
      setReplyMessage('');
      setSelectedInterest(null);
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const handleViewDetails = (interest: InterestForm) => {
    setSelectedInterest(interest);
    if (interest.status === 'new') {
      onMarkAsRead(interest.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interest Submissions</h2>
          <p className="text-gray-600">Manage inquiries from potential buyers and renters</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{filteredInterests.length}</span>
          <span>total interests</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="not_interested">Not Interested</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interests List */}
      {filteredInterests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MessageSquare className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interests Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No interests match your current filters.'
                : 'You haven\'t received any interest submissions yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredInterests.map((interest) => (
            <Card 
              key={interest.id} 
              className={cn(
                "hover:shadow-md transition-shadow cursor-pointer",
                interest.status === 'new' && "border-l-4 border-l-blue-500"
              )}
              onClick={() => handleViewDetails(interest)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {interest.personalInfo.fullName}
                          {interest.status === 'new' && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{interest.personalInfo.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn('text-xs', getStatusColor(interest.status))}>
                          {interest.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={cn('text-xs', getPriorityColor(interest.priority))}>
                          {interest.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{interest.personalInfo.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Submitted {formatDate(interest.createdAt)}</span>
                        </div>
                      </div>
                      
                      {interest.property && (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="truncate">{interest.property.title}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>{formatCurrency(interest.property.price, interest.property.currency)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {interest.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 line-clamp-2">{interest.message}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(interest);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${interest.personalInfo.email}`, '_blank');
                        }}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${interest.personalInfo.phone}`, '_blank');
                        }}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Interest Details Dialog */}
      <Dialog open={!!selectedInterest} onOpenChange={() => setSelectedInterest(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Interest Details
            </DialogTitle>
            <DialogDescription>
              Review and respond to this interest submission
            </DialogDescription>
          </DialogHeader>

          {selectedInterest && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{selectedInterest.personalInfo.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedInterest.personalInfo.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900">{selectedInterest.personalInfo.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Submitted</label>
                    <p className="text-gray-900">{formatDate(selectedInterest.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              {selectedInterest.property && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Property Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{selectedInterest.property.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{selectedInterest.property.location?.address}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{formatCurrency(selectedInterest.property.price, selectedInterest.property.currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              {selectedInterest.message && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedInterest.message}</p>
                  </div>
                </div>
              )}

              {/* Contact Preferences */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-600">Preferred Contact Method</label>
                    <p className="text-gray-900 capitalize">{selectedInterest.contactPreferences.preferredMethod}</p>
                  </div>
                  <div>
                    <label className="text-gray-600">Best Time to Contact</label>
                    <p className="text-gray-900 capitalize">{selectedInterest.contactPreferences.bestTimeToContact}</p>
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Send Reply</h3>
                <Textarea
                  placeholder="Type your response here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => selectedInterest && onArchive(selectedInterest.id)}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
            <Button
              onClick={handleReply}
              disabled={!replyMessage.trim() || isReplying}
            >
              <Reply className="h-4 w-4 mr-1" />
              {isReplying ? 'Sending...' : 'Send Reply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

