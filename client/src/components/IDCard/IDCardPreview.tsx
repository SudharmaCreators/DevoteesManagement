import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { QrCode } from "lucide-react";
import { Devotee } from "@shared/schema";

interface IDCardPreviewProps {
  devotee: Devotee;
  template: string;
  includeQRCode: boolean;
  includePhoto: boolean;
}

export function IDCardPreview({ devotee, template, includeQRCode, includePhoto }: IDCardPreviewProps) {
  const getTemplateStyles = () => {
    switch (template) {
      case "devotional":
        return {
          background: "bg-gradient-to-br from-orange-50 to-red-50",
          border: "border-orange-200",
          header: "bg-gradient-to-r from-orange-500 to-red-600",
          accent: "text-orange-600"
        };
      case "festival":
        return {
          background: "bg-gradient-to-br from-yellow-50 to-orange-50",
          border: "border-yellow-200",
          header: "bg-gradient-to-r from-yellow-500 to-orange-500",
          accent: "text-yellow-600"
        };
      case "vip":
        return {
          background: "bg-gradient-to-br from-purple-50 to-blue-50",
          border: "border-purple-200",
          header: "bg-gradient-to-r from-purple-600 to-blue-600",
          accent: "text-purple-600"
        };
      case "minimal":
        return {
          background: "bg-white",
          border: "border-gray-200",
          header: "bg-gray-800",
          accent: "text-gray-600"
        };
      default: // standard
        return {
          background: "bg-gradient-to-br from-blue-50 to-indigo-50",
          border: "border-blue-200",
          header: "bg-gradient-to-r from-blue-600 to-indigo-600",
          accent: "text-blue-600"
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="max-w-sm mx-auto">
      <Card className={`${styles.background} ${styles.border} border-2 overflow-hidden`}>
        {/* Header */}
        <div className={`${styles.header} text-white p-4 text-center`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">॥</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Madhav Parivar</h3>
              <p className="text-xs opacity-90">Devotee ID Card</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 text-center space-y-4">
          {/* Photo */}
          {includePhoto && (
            <div className="flex justify-center">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage 
                  src={devotee.profileImageUrl || ""} 
                  alt={`${devotee.firstName} ${devotee.lastName}`} 
                />
                <AvatarFallback className="text-2xl font-bold">
                  {devotee.firstName?.[0]}{devotee.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Name and Details */}
          <div className="space-y-2">
            <h4 className="font-bold text-xl text-gray-800">
              {devotee.firstName} {devotee.lastName}
            </h4>
            <div className="space-y-1">
              <p className={`text-sm font-medium ${styles.accent}`}>
                ID: {devotee.devoteeId}
              </p>
              {devotee.spiritualLevel && (
                <Badge variant="outline" className="text-xs">
                  {devotee.spiritualLevel}
                </Badge>
              )}
              <p className="text-xs text-gray-600">
                Member since {devotee.joinDate ? new Date(devotee.joinDate).getFullYear() : "Unknown"}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-xs text-gray-600 space-y-1">
            {devotee.phone && <p>📱 {devotee.phone}</p>}
            {devotee.email && <p>✉️ {devotee.email}</p>}
            {devotee.city && <p>📍 {devotee.city}, {devotee.state}</p>}
          </div>

          {/* QR Code */}
          {includeQRCode && (
            <div className="flex justify-center pt-2">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
                <QrCode className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {devotee.emergencyContact && (
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p className="font-medium">Emergency: {devotee.emergencyContact}</p>
              {devotee.emergencyContactNumber && (
                <p>{devotee.emergencyContactNumber}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-2 text-center">
          <p className="text-xs text-gray-500">
            This card is property of Madhav Parivar Organization
          </p>
        </div>
      </Card>
    </div>
  );
}
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Phone, MapPin } from "lucide-react";

interface IDCardPreviewProps {
  devotee: any;
}

export function IDCardPreview({ devotee }: IDCardPreviewProps) {
  if (!devotee) return null;

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-3 text-center">
            <h3 className="font-bold text-sm">॥ Madhav Parivar ॥</h3>
            <p className="text-xs opacity-90">Member ID Card</p>
          </div>

          {/* Main Content */}
          <div className="p-4 space-y-3">
            {/* Photo and Basic Info */}
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                {devotee.profileImage ? (
                  <img 
                    src={devotee.profileImage} 
                    alt={devotee.firstName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">
                  {devotee.firstName} {devotee.lastName}
                </h4>
                <p className="text-xs text-muted-foreground">
                  ID: {devotee.devoteeId}
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {devotee.spiritualLevel || 'Active'}
                </Badge>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs">
              {devotee.dateOfBirth && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>{new Date(devotee.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
              
              {devotee.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <span>{devotee.phone}</span>
                </div>
              )}
              
              {devotee.city && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span>{devotee.city}, {devotee.state}</span>
                </div>
              )}
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center pt-2">
              <div className="w-12 h-12 bg-muted rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">QR</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-muted px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">
              Valid • {new Date().getFullYear()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
