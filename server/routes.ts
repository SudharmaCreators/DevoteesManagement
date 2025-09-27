import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage as getStorage, MockStorage } from "./storage";
// import { setupAuth, isAuthenticated } from "./replitAuth";

// Mock authentication for development
const isAuthenticated = (req: any, res: any, next: any) => {
  // Mock user data for development
  req.user = {
    claims: {
      sub: 'dev-user-1'
    }
  };
  next();
};
import {
  insertDevoteeSchema,
  insertFamilySchema,
  insertMentorSchema,
  insertAttendanceSchema,
  insertDonationSchema,
  insertEventSchema,
  insertVolunteeringSchema,
  insertGroupSchema,
  insertGroupEntrySchema,
  insertMandalSchema,
  insertSabhaLocationSchema,
  insertDashboardLayoutSchema,
  insertUserPreferencesSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - temporarily disabled for development
  // await setupAuth(app);

  // Temporary mock auth for development
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // For development, return a mock user
      const mockUser = {
        id: 'dev-user-1',
        email: 'dev@example.com',
        firstName: 'Dev',
        lastName: 'User',
        profileImageUrl: null,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.json(mockUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Devotee routes - temporarily remove auth middleware
  app.get('/api/devotees', async (req, res) => {
    try {
      const devotees = await getStorage().getDevotees();
      res.json(devotees);
    } catch (error) {
      console.error("Error fetching devotees:", error);
      res.status(500).json({ message: "Failed to fetch devotees" });
    }
  });

  app.get('/api/devotees/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const devotee = await getStorage().getDevotee(id);
      if (!devotee) {
        return res.status(404).json({ message: "Devotee not found" });
      }
      res.json(devotee);
    } catch (error) {
      console.error("Error fetching devotee:", error);
      res.status(500).json({ message: "Failed to fetch devotee" });
    }
  });

  app.post('/api/devotees', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDevoteeSchema.parse(req.body);
      const devotee = await getStorage().createDevotee(validatedData);
      res.status(201).json(devotee);
    } catch (error) {
      console.error("Error creating devotee:", error);
      res.status(400).json({ message: "Invalid devotee data" });
    }
  });

  app.put('/api/devotees/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDevoteeSchema.partial().parse(req.body);
      const devotee = await getStorage().updateDevotee(id, validatedData);
      res.json(devotee);
    } catch (error) {
      console.error("Error updating devotee:", error);
      res.status(400).json({ message: "Invalid devotee data" });
    }
  });

  app.delete('/api/devotees/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await getStorage().deleteDevotee(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Devotee not found" });
      }
    } catch (error) {
      console.error("Error deleting devotee:", error);
      res.status(500).json({ message: "Failed to delete devotee" });
    }
  });

  // Family routes
  app.get('/api/families', isAuthenticated, async (req, res) => {
    try {
      const families = await getStorage().getFamilies();
      res.json(families);
    } catch (error) {
      console.error("Error fetching families:", error);
      res.status(500).json({ message: "Failed to fetch families" });
    }
  });

  app.post('/api/families', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertFamilySchema.parse(req.body);
      const family = await getStorage().createFamily(validatedData);
      res.status(201).json(family);
    } catch (error) {
      console.error("Error creating family:", error);
      res.status(400).json({ message: "Invalid family data" });
    }
  });

  // Mentor routes
  app.get('/api/mentors', isAuthenticated, async (req, res) => {
    try {
      const mentors = await getStorage().getMentors();
      res.json(mentors);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      res.status(500).json({ message: "Failed to fetch mentors" });
    }
  });

  app.post('/api/mentors', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMentorSchema.parse(req.body);
      const mentor = await getStorage().createMentor(validatedData);
      res.status(201).json(mentor);
    } catch (error) {
      console.error("Error creating mentor:", error);
      res.status(400).json({ message: "Invalid mentor data" });
    }
  });

  // Attendance routes
  app.get('/api/attendance', isAuthenticated, async (req, res) => {
    try {
      const devoteeId = req.query.devoteeId ? parseInt(req.query.devoteeId as string) : undefined;
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const attendance = await getStorage().getAttendance(devoteeId, eventId);
      res.json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.post('/api/attendance', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertAttendanceSchema.parse({
        ...req.body,
        recordedBy: req.user.claims.sub,
      });
      const attendance = await getStorage().createAttendance(validatedData);
      res.status(201).json(attendance);
    } catch (error) {
      console.error("Error creating attendance:", error);
      res.status(400).json({ message: "Invalid attendance data" });
    }
  });

  // Donation routes
  app.get('/api/donations', isAuthenticated, async (req, res) => {
    try {
      const devoteeId = req.query.devoteeId ? parseInt(req.query.devoteeId as string) : undefined;
      const donations = await getStorage().getDonations(devoteeId);
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  app.post('/api/donations', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertDonationSchema.parse({
        ...req.body,
        recordedBy: req.user.claims.sub,
      });
      const donation = await getStorage().createDonation(validatedData);
      res.status(201).json(donation);
    } catch (error) {
      console.error("Error creating donation:", error);
      res.status(400).json({ message: "Invalid donation data" });
    }
  });

  // Event routes
  app.get('/api/events', isAuthenticated, async (req, res) => {
    try {
      const events = await getStorage().getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertEventSchema.parse({
        ...req.body,
        organizerId: req.user.claims.sub,
      });
      const event = await getStorage().createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  // Volunteering routes
  app.get('/api/volunteering', isAuthenticated, async (req, res) => {
    try {
      const devoteeId = req.query.devoteeId ? parseInt(req.query.devoteeId as string) : undefined;
      const volunteering = await getStorage().getVolunteering(devoteeId);
      res.json(volunteering);
    } catch (error) {
      console.error("Error fetching volunteering:", error);
      res.status(500).json({ message: "Failed to fetch volunteering" });
    }
  });

  app.post('/api/volunteering', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVolunteeringSchema.parse(req.body);
      const volunteering = await getStorage().createVolunteering(validatedData);
      res.status(201).json(volunteering);
    } catch (error) {
      console.error("Error creating volunteering:", error);
      res.status(400).json({ message: "Invalid volunteering data" });
    }
  });

  // Group routes
  app.get('/api/groups', isAuthenticated, async (req, res) => {
    try {
      const groups = await getStorage().getGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.post('/api/groups', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertGroupSchema.parse(req.body);
      const group = await getStorage().createGroup(validatedData);
      res.status(201).json(group);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(400).json({ message: "Invalid group data" });
    }
  });

  app.put('/api/groups/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertGroupSchema.partial().parse(req.body);
      const group = await getStorage().updateGroup(id, validatedData);
      res.json(group);
    } catch (error) {
      console.error("Error updating group:", error);
      res.status(400).json({ message: "Invalid group data" });
    }
  });

  app.delete('/api/groups/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await getStorage().deleteGroup(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Group not found" });
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      res.status(500).json({ message: "Failed to delete group" });
    }
  });

  // Group entries routes
  app.get('/api/group-entries', isAuthenticated, async (req, res) => {
    try {
      const groupId = req.query.groupId ? parseInt(req.query.groupId as string) : undefined;
      const entries = await getStorage().getGroupEntries(groupId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching group entries:", error);
      res.status(500).json({ message: "Failed to fetch group entries" });
    }
  });

  app.post('/api/group-entries', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertGroupEntrySchema.parse(req.body);
      const entry = await getStorage().createGroupEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating group entry:", error);
      res.status(400).json({ message: "Invalid group entry data" });
    }
  });

  // Mandal routes
  app.get('/api/mandals', isAuthenticated, async (req, res) => {
    try {
      const mandals = await getStorage().getMandals();
      res.json(mandals);
    } catch (error) {
      console.error("Error fetching mandals:", error);
      res.status(500).json({ message: "Failed to fetch mandals" });
    }
  });

  app.post('/api/mandals', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertMandalSchema.parse(req.body);
      const mandal = await getStorage().createMandal(validatedData);
      res.status(201).json(mandal);
    } catch (error) {
      console.error("Error creating mandal:", error);
      res.status(400).json({ message: "Invalid mandal data" });
    }
  });

  // Sabha location routes
  app.get('/api/sabha-locations', isAuthenticated, async (req, res) => {
    try {
      const locations = await getStorage().getSabhaLocations();
      res.json(locations);
    } catch (error) {
      console.error("Error fetching sabha locations:", error);
      res.status(500).json({ message: "Failed to fetch sabha locations" });
    }
  });

  app.post('/api/sabha-locations', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSabhaLocationSchema.parse(req.body);
      const location = await getStorage().createSabhaLocation(validatedData);
      res.status(201).json(location);
    } catch (error) {
      console.error("Error creating sabha location:", error);
      res.status(400).json({ message: "Invalid sabha location data" });
    }
  });

  // Dashboard layout routes
  app.get('/api/dashboard-layouts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const layouts = await getStorage().getDashboardLayouts(userId);
      res.json(layouts);
    } catch (error) {
      console.error("Error fetching dashboard layouts:", error);
      res.status(500).json({ message: "Failed to fetch dashboard layouts" });
    }
  });

  app.post('/api/dashboard-layouts', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertDashboardLayoutSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
      });
      const layout = await getStorage().createDashboardLayout(validatedData);
      res.status(201).json(layout);
    } catch (error) {
      console.error("Error creating dashboard layout:", error);
      res.status(400).json({ message: "Invalid dashboard layout data" });
    }
  });

  // User preferences routes
  app.get('/api/user-preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await getStorage().getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.post('/api/user-preferences', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertUserPreferencesSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
      });
      const preferences = await getStorage().upsertUserPreferences(validatedData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating user preferences:", error);
      res.status(400).json({ message: "Invalid user preferences data" });
    }
  });

  // Analytics routes
  app.get('/api/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await getStorage().getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}