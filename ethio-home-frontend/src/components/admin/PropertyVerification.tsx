import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  MapPin,
  DollarSign,
  Home,
  User,
  Calendar,
  AlertTriangle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helpers';

// Mock property data for verification
const mockProperties = [
  {
    id: '1',
    title: 'Modern Villa in Bole',
    location: 'Bole, Addis Ababa',
    price: 2500000,
    currency: 'ETB',
    type: 'villa',
    status: 'for-sale',
    verificationStatus: 'pending',
    submittedDate: '2024-08-10',
    owner: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+251922345678',
    },
    images: ['/placeholder-property.jpg'],
    documents: ['title_deed.pdf', 'tax_certificate.pdf'],
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      parking: true,
      garden: true,
    },
    description: 'Beautiful modern villa with spacious rooms and garden.',
    verificationNotes: '',
  },
  {
    id: '2',
    title: 'Apartment in Kazanchis',
    location: 'Kazanchis, Addis Ababa',
    price: 15000,
    currency: 'ETB',
    type: 'apartment',
    status: 'for-rent',
    verificationStatus: 'pending',
    submittedDate: '2024-08-09',
    owner: {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+251933456789',
    },
    images: ['/placeholder-property.jpg'],
    documents: ['rental_agreement.pdf'],
    features: {
      bedrooms: 2,
      bathrooms: 1,
      area: 120,
      parking: false,
      garden: false,
    },
    description: 'Cozy apartment in the heart of the city.',
    verificationNotes: '',
  },
  {
    id: '3',
    title: 'Commercial Building in Merkato',
    location: 'Merkato, Addis Ababa',
    price: 5000000,
    currency: 'ETB',
    type: 'commercial',
    status: 'for-sale',
    verificationStatus: 'rejected',
    submittedDate: '2024-08-08',
    owner: {
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      phone: '+251944567890',
    },
    images: ['/placeholder-property.jpg'],
    documents: ['business_license.pdf'],
    features: {
      bedrooms: 0,
      bathrooms: 2,
      area: 500,
      parking: true,
      garden: false,
    },
    description: 'Prime commercial space in busy market area.',
    verificationNotes: 'Missing required documentation. Title deed not provided.',
  },
];

export const PropertyVerification: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [verificationAction, setVerificationAction] = useState<'approve' | 'reject' | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.verificationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleVerification = (action: 'approve' | 'reject') => {
    if (!selectedProperty) return;
    
    console.log(`${action} property ${selectedProperty.id}`, { notes: verificationNotes });
    
    // Update property status (in real app, this would be an API call)
    const updatedStatus = action === 'approve' ? 'verified' : 'rejected';
    
    // Reset form
    setSelectedProperty(null);
    setVerificationAction(null);
    setVerificationNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Verification</h1>
          <p className="text-gray-600">Review and verify property listings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mockProperties.filter(p => p.verificationStatus === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockProperties.filter(p => p.verificationStatus === 'verified').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {mockProperties.filter(p => p.verificationStatus === 'rejected').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{mockProperties.length}</p>
              </div>
              <Home className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search properties by title or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>Properties for Verification ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900">{property.title}</h3>
                      <Badge className={getStatusColor(property.verificationStatus)}>
                        {getStatusIcon(property.verificationStatus)}
                        <span className="ml-1">{property.verificationStatus}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(property.price, property.currency)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        {property.type}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {property.owner.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Submitted {formatDate(property.submittedDate)}
                      </div>
                      <div>
                        {property.documents.length} documents
                      </div>
                    </div>

                    {property.verificationNotes && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        {property.verificationNotes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProperty(property)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                  
                  {property.verificationStatus === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedProperty(property);
                          setVerificationAction('approve');
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedProperty(property);
                          setVerificationAction('reject');
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-8">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Detail Modal */}
      {selectedProperty && !verificationAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Property Review</span>
                <Button variant="ghost" onClick={() => setSelectedProperty(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Property Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{selectedProperty.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900">{selectedProperty.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Price</label>
                      <p className="text-sm text-gray-900">
                        {formatCurrency(selectedProperty.price, selectedProperty.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{selectedProperty.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <p className="text-sm text-gray-900">{selectedProperty.status}</p>
                    </div>
                  </div>
                </div>

                {/* Owner Info */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Owner Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedProperty.owner.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedProperty.owner.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedProperty.owner.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Property Features */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Property Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{selectedProperty.features.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{selectedProperty.features.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{selectedProperty.features.area}m²</div>
                      <div className="text-sm text-gray-600">Area</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{selectedProperty.features.parking ? 'Yes' : 'No'}</div>
                      <div className="text-sm text-gray-600">Parking</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Description</h4>
                  <p className="text-sm text-gray-700">{selectedProperty.description}</p>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Documents</h4>
                  <div className="space-y-2">
                    {selectedProperty.documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{doc}</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => setVerificationAction('approve')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Property
                  </Button>
                  <Button
                    onClick={() => setVerificationAction('reject')}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Property
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Verification Action Modal */}
      {selectedProperty && verificationAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {verificationAction === 'approve' ? 'Approve Property' : 'Reject Property'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {verificationAction === 'approve' 
                    ? 'Are you sure you want to approve this property? It will be visible to all users.'
                    : 'Please provide a reason for rejecting this property. The owner will be notified.'
                  }
                </p>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {verificationAction === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason *'}
                  </label>
                  <Textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder={
                      verificationAction === 'approve' 
                        ? 'Add any notes about the approval...'
                        : 'Explain why this property is being rejected...'
                    }
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setVerificationAction(null);
                      setVerificationNotes('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleVerification(verificationAction)}
                    className={verificationAction === 'approve' ? 'flex-1 bg-green-600 hover:bg-green-700' : 'flex-1'}
                    variant={verificationAction === 'approve' ? 'default' : 'destructive'}
                  >
                    {verificationAction === 'approve' ? 'Approve' : 'Reject'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

