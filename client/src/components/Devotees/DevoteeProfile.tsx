import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Phone, Mail, Calendar, MapPin, User } from "lucide-react";
import { Devotee } from "@shared/schema";

interface DevoteeProfileProps {
  devotee: Devotee;
  onEdit?: () => void;
}

export function DevoteeProfile({ devotee, onEdit }: DevoteeProfileProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Devotee Profile</CardTitle>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={devotee.profileImageUrl || ""} alt={`${devotee.firstName} ${devotee.lastName}`} />
            <AvatarFallback>
              {devotee.firstName?.[0]}{devotee.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg">
              {devotee.firstName} {devotee.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">
              ID: {devotee.devoteeId}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={devotee.isActive ? "default" : "secondary"}>
                {devotee.isActive ? "Active" : "Inactive"}
              </Badge>
              {devotee.spiritualLevel && (
                <Badge variant="outline">{devotee.spiritualLevel}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Phone:</strong> {devotee.phone || "Not provided"}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Email:</strong> {devotee.email || "Not provided"}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Date of Birth:</strong> {
                  devotee.dateOfBirth 
                    ? new Date(devotee.dateOfBirth).toLocaleDateString()
                    : "Not provided"
                }
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Location:</strong> {devotee.city || "Not provided"}
                {devotee.state && `, ${devotee.state}`}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Occupation:</strong> {devotee.occupation || "Not provided"}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Joined:</strong> {
                  devotee.joinDate 
                    ? new Date(devotee.joinDate).toLocaleDateString()
                    : "Unknown"
                }
              </span>
            </div>
          </div>
        </div>

        {devotee.notes && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Notes</h4>
            <p className="text-sm text-muted-foreground">{devotee.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
