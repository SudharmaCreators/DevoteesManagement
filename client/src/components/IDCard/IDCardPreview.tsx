import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { QrCode } from "lucide-react";
import { Devotee } from "@shared/schema";

interface IDCardPreviewProps {
  devotee: Devotee;
  template?: string;
  includeQRCode?: boolean;
  includePhoto?: boolean;
}

export function IDCardPreview({ devotee, template = "standard", includeQRCode = true, includePhoto = true }: IDCardPreviewProps) {
  if (!devotee) return null;

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
      <Card className={`${styles.background} ${styles.border} border-2 overflow-hidden shadow-lg`}>
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
            <div className="flex justify-center mb-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src={devotee.photoUrl || ''} alt={`${devotee.firstName} ${devotee.lastName}`} />
                <AvatarFallback className={`text-xl font-bold ${styles.accent} bg-white`}>
                  {devotee.firstName.charAt(0)}{devotee.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Name */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {devotee.firstName} {devotee.lastName}
            </h2>
            <Badge variant="outline" className={`${styles.accent} border-current`}>
              ID: {devotee.devoteeId}
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="text-sm text-gray-600 space-y-1">
            <div>{devotee.phone}</div>
            <div className="text-xs">{devotee.email}</div>
            {devotee.address && (
              <div className="text-xs text-gray-500 mt-2">
                {devotee.address}
              </div>
            )}
          </div>

          {/* QR Code */}
          {includeQRCode && (
            <div className="flex justify-center pt-2">
              <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
                <QrCode className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
            <p>Valid Devotee ID Card</p>
            <p className="text-gray-400">Krishna Temple Organization</p>
          </div>
        </div>
      </Card>
    </div>
  );
}