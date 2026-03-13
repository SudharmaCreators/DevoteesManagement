import {
  type User,
  type UpsertUser,
  type Devotee,
  type InsertDevotee,
  type Family,
  type InsertFamily,
  type Mentor,
  type InsertMentor,
  type Attendance,
  type InsertAttendance,
  type Donation,
  type InsertDonation,
  type Event,
  type InsertEvent,
  type Volunteering,
  type InsertVolunteering,
  type Group,
  type InsertGroup,
  type GroupEntry,
  type InsertGroupEntry,
  type Mandal,
  type InsertMandal,
  type SabhaLocation,
  type InsertSabhaLocation,
  type DashboardLayout,
  type InsertDashboardLayout,
  type UserPreferences,
  type InsertUserPreferences,
} from "@shared/schema";
import { type IStorage } from "./storage";

// In-memory storage implementation
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private devotees: Map<number, Devotee> = new Map();
  private families: Map<number, Family> = new Map();
  private mentors: Map<number, Mentor> = new Map();
  private attendance: Map<number, Attendance> = new Map();
  private donations: Map<number, Donation> = new Map();
  private events: Map<number, Event> = new Map();
  private volunteering: Map<number, Volunteering> = new Map();
  private groups: Map<number, Group> = new Map();
  private groupEntries: Map<number, GroupEntry> = new Map();
  private mandals: Map<number, Mandal> = new Map();
  private sabhaLocations: Map<number, SabhaLocation> = new Map();
  private dashboardLayouts: Map<number, DashboardLayout> = new Map();
  private userPreferences: Map<string, UserPreferences> = new Map();

  // Counter for auto-incrementing IDs
  private counters = {
    devotees: 1,
    families: 1,
    mentors: 1,
    attendance: 1,
    donations: 1,
    events: 1,
    volunteering: 1,
    groups: 1,
    groupEntries: 1,
    mandals: 1,
    sabhaLocations: 1,
    dashboardLayouts: 1,
  };

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const now = new Date();
    const d = (daysAgo: number) => { const dt = new Date(now); dt.setDate(dt.getDate() - daysAgo); return dt; };
    const future = (daysAhead: number) => { const dt = new Date(now); dt.setDate(dt.getDate() + daysAhead); return dt; };

    // ─── FAMILIES ────────────────────────────────────────────────────
    const sampleFamilies: Family[] = [
      { id: 1, familyName: "Sharma Family", headOfFamily: 1, address: "42 Tulsi Nagar", city: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India", phone: "9876543210", email: "sharma@email.com", totalMembers: 4, emergencyContact: "Ramesh Sharma", notes: null, isActive: true, createdAt: d(365), updatedAt: now },
      { id: 2, familyName: "Patel Family", headOfFamily: 5, address: "17 Krishna Lane", city: "Surat", state: "Gujarat", pincode: "395001", country: "India", phone: "9876543220", email: "patel@email.com", totalMembers: 3, emergencyContact: "Suresh Patel", notes: null, isActive: true, createdAt: d(300), updatedAt: now },
      { id: 3, familyName: "Desai Family", headOfFamily: 8, address: "5 Radha Niwas", city: "Vadodara", state: "Gujarat", pincode: "390001", country: "India", phone: "9876543230", email: "desai@email.com", totalMembers: 3, emergencyContact: "Nilesh Desai", notes: null, isActive: true, createdAt: d(250), updatedAt: now },
    ];
    sampleFamilies.forEach(f => { this.families.set(f.id, f); this.counters.families = Math.max(this.counters.families, f.id + 1); });

    // ─── DEVOTEES ─────────────────────────────────────────────────────
    const sampleDevotees: Devotee[] = [
      { id: 1, devoteeId: "MP-001", firstName: "Ramesh", lastName: "Sharma", email: "ramesh.sharma@email.com", phone: "9876543210", whatsappNumber: "9876543210", dateOfBirth: new Date("1975-03-15"), gender: "Male", address: "42 Tulsi Nagar", city: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India", occupation: "Engineer", spiritualLevel: "Advanced", joinDate: d(1200), mentorId: 1, familyId: 1, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh", notes: "Very dedicated devotee", specialSkills: "Kirtans, Teaching", previousExperience: "5 years in seva", emergencyContact: "Sunita Sharma", emergencyPhone: "9876543211", medicalConditions: null, dietaryPreferences: "Vegetarian", isActive: true, createdAt: d(1200), updatedAt: now },
      { id: 2, devoteeId: "MP-002", firstName: "Sunita", lastName: "Sharma", email: "sunita.sharma@email.com", phone: "9876543211", whatsappNumber: "9876543211", dateOfBirth: new Date("1978-07-22"), gender: "Female", address: "42 Tulsi Nagar", city: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India", occupation: "Teacher", spiritualLevel: "Intermediate", joinDate: d(1100), mentorId: 1, familyId: 1, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita", notes: "Leads women's satsang", specialSkills: "Bhajan singing", previousExperience: "3 years", emergencyContact: "Ramesh Sharma", emergencyPhone: "9876543210", medicalConditions: null, dietaryPreferences: "Vegan", isActive: true, createdAt: d(1100), updatedAt: now },
      { id: 3, devoteeId: "MP-003", firstName: "Arjun", lastName: "Sharma", email: "arjun.sharma@email.com", phone: "9876543212", whatsappNumber: "9876543212", dateOfBirth: new Date("2000-11-05"), gender: "Male", address: "42 Tulsi Nagar", city: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India", occupation: "Student", spiritualLevel: "Beginner", joinDate: d(400), mentorId: null, familyId: 1, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", notes: "Youth leader", specialSkills: "Mridanga", previousExperience: null, emergencyContact: "Ramesh Sharma", emergencyPhone: "9876543210", medicalConditions: null, dietaryPreferences: "Vegetarian", isActive: true, createdAt: d(400), updatedAt: now },
      { id: 4, devoteeId: "MP-004", firstName: "Priya", lastName: "Sharma", email: "priya.sharma@email.com", phone: "9876543213", whatsappNumber: "9876543213", dateOfBirth: new Date("2003-05-18"), gender: "Female", address: "42 Tulsi Nagar", city: "Ahmedabad", state: "Gujarat", pincode: "380001", country: "India", occupation: "Student", spiritualLevel: "Beginner", joinDate: d(300), mentorId: null, familyId: 1, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", notes: null, specialSkills: "Art and crafts", previousExperience: null, emergencyContact: "Sunita Sharma", emergencyPhone: "9876543211", medicalConditions: null, dietaryPreferences: "Vegetarian", isActive: true, createdAt: d(300), updatedAt: now },
      { id: 5, devoteeId: "MP-005", firstName: "Suresh", lastName: "Patel", email: "suresh.patel@email.com", phone: "9876543220", whatsappNumber: "9876543220", dateOfBirth: new Date("1968-09-30"), gender: "Male", address: "17 Krishna Lane", city: "Surat", state: "Gujarat", pincode: "395001", country: "India", occupation: "Businessman", spiritualLevel: "Teacher", joinDate: d(1500), mentorId: null, familyId: 2, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh", notes: "Major donor and organizer", specialSkills: "Event management, Finance", previousExperience: "10 years in seva", emergencyContact: "Meena Patel", emergencyPhone: "9876543221", medicalConditions: "Diabetes - diet controlled", dietaryPreferences: "Vegan", isActive: true, createdAt: d(1500), updatedAt: now },
      { id: 6, devoteeId: "MP-006", firstName: "Meena", lastName: "Patel", email: "meena.patel@email.com", phone: "9876543221", whatsappNumber: "9876543221", dateOfBirth: new Date("1972-02-14"), gender: "Female", address: "17 Krishna Lane", city: "Surat", state: "Gujarat", pincode: "395001", country: "India", occupation: "Doctor", spiritualLevel: "Advanced", joinDate: d(1400), mentorId: 1, familyId: 2, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meena", notes: "Provides medical support at events", specialSkills: "Medical aid, Counseling", previousExperience: "8 years", emergencyContact: "Suresh Patel", emergencyPhone: "9876543220", medicalConditions: null, dietaryPreferences: "Vegetarian", isActive: true, createdAt: d(1400), updatedAt: now },
      { id: 7, devoteeId: "MP-007", firstName: "Rohan", lastName: "Patel", email: "rohan.patel@email.com", phone: "9876543222", whatsappNumber: "9876543222", dateOfBirth: new Date("1998-08-20"), gender: "Male", address: "17 Krishna Lane", city: "Surat", state: "Gujarat", pincode: "395001", country: "India", occupation: "IT Professional", spiritualLevel: "Intermediate", joinDate: d(600), mentorId: null, familyId: 2, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan", notes: "Manages digital initiatives", specialSkills: "Technology, Web Design", previousExperience: "2 years", emergencyContact: "Suresh Patel", emergencyPhone: "9876543220", medicalConditions: null, dietaryPreferences: "Vegetarian", isActive: true, createdAt: d(600), updatedAt: now },
      { id: 8, devoteeId: "MP-008", firstName: "Nilesh", lastName: "Desai", email: "nilesh.desai@email.com", phone: "9876543230", whatsappNumber: "9876543230", dateOfBirth: new Date("1970-12-10"), gender: "Male", address: "5 Radha Niwas", city: "Vadodara", state: "Gujarat", pincode: "390001", country: "India", occupation: "Professor", spiritualLevel: "Mentor", joinDate: d(2000), mentorId: null, familyId: 3, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nilesh", notes: "Senior mentor, teaches Bhagavad Gita", specialSkills: "Sanskrit, Philosophy, Teaching", previousExperience: "15 years", emergencyContact: "Kavita Desai", emergencyPhone: "9876543231", medicalConditions: null, dietaryPreferences: "Vegetarian", isActive: true, createdAt: d(2000), updatedAt: now },
      { id: 9, devoteeId: "MP-009", firstName: "Kavita", lastName: "Desai", email: "kavita.desai@email.com", phone: "9876543231", whatsappNumber: "9876543231", dateOfBirth: new Date("1974-04-25"), gender: "Female", address: "5 Radha Niwas", city: "Vadodara", state: "Gujarat", pincode: "390001", country: "India", occupation: "Homemaker", spiritualLevel: "Advanced", joinDate: d(1800), mentorId: 1, familyId: 3, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita", notes: "Organizes prasad distribution", specialSkills: "Cooking, Event decoration", previousExperience: "12 years", emergencyContact: "Nilesh Desai", emergencyPhone: "9876543230", medicalConditions: null, dietaryPreferences: "Vegetarian", isActive: true, createdAt: d(1800), updatedAt: now },
      { id: 10, devoteeId: "MP-010", firstName: "Tanvi", lastName: "Desai", email: "tanvi.desai@email.com", phone: "9876543232", whatsappNumber: "9876543232", dateOfBirth: new Date("2002-01-30"), gender: "Female", address: "5 Radha Niwas", city: "Vadodara", state: "Gujarat", pincode: "390001", country: "India", occupation: "Student", spiritualLevel: "Beginner", joinDate: d(200), mentorId: null, familyId: 3, profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvi", notes: null, specialSkills: "Dance, Music", previousExperience: null, emergencyContact: "Kavita Desai", emergencyPhone: "9876543231", medicalConditions: null, dietaryPreferences: "Vegetarian", isActive: true, createdAt: d(200), updatedAt: now },
    ];
    sampleDevotees.forEach(dv => { this.devotees.set(dv.id, dv); this.counters.devotees = Math.max(this.counters.devotees, dv.id + 1); });

    // ─── GROUPS ───────────────────────────────────────────────────────
    const sampleGroups: Group[] = [
      { id: 1, groupName: "Youth Satsang", description: "Group for young devotees ages 16-30", mentorId: 1, createdAt: d(400), updatedAt: now },
      { id: 2, familyName: "Family Circle", description: "Family devotional activities and support", groupName: "Family Circle", mentorId: null, createdAt: d(300), updatedAt: now },
      { id: 3, groupName: "Families", description: "Families group", mentorId: null, createdAt: d(300), updatedAt: now },
      { id: 4, groupName: "Kirtan Mandali", description: "Devotional singing group", mentorId: null, createdAt: d(500), updatedAt: now },
      { id: 5, groupName: "Seva Squad", description: "Volunteers for event organization", mentorId: null, createdAt: d(350), updatedAt: now },
      { id: 6, groupName: "Gita Study Circle", description: "Bhagavad Gita study group led by Nilesh Desai", mentorId: null, createdAt: d(600), updatedAt: now },
    ];
    sampleGroups.forEach(g => { this.groups.set(g.id, g); this.counters.groups = Math.max(this.counters.groups, g.id + 1); });

    // ─── EVENTS ───────────────────────────────────────────────────────
    const sampleEvents: Event[] = [
      { id: 1, title: "Janmashtami Mahotsav 2025", description: "Grand celebration of Lord Krishna's birth. Night-long kirtan, drama, and prasad.", eventType: "festival", location: "Main Sabha Hall, Ahmedabad", startDate: future(15), endDate: future(15), startTime: "18:00", endTime: "06:00", capacity: 500, registrationRequired: true, registrationDeadline: future(10), cost: "0", status: "planned", imageUrl: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=400", isArchived: false, archivedAt: null, maxParticipants: 500, createdBy: "admin", isActive: true, createdAt: d(30), updatedAt: now },
      { id: 2, title: "Weekly Sunday Satsang", description: "Regular weekly devotional gathering with kirtan and discourse.", eventType: "satsang", location: "Community Center, Surat", startDate: future(5), endDate: future(5), startTime: "09:00", endTime: "11:30", capacity: 150, registrationRequired: false, registrationDeadline: null, cost: "0", status: "planned", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", isArchived: false, archivedAt: null, maxParticipants: 150, createdBy: "admin", isActive: true, createdAt: d(10), updatedAt: now },
      { id: 3, title: "Bhagavad Gita Workshop", description: "3-day intensive workshop on Bhagavad Gita's practical teachings led by Nilesh Desai.", eventType: "workshop", location: "Radha Niwas, Vadodara", startDate: future(25), endDate: future(27), startTime: "08:00", endTime: "17:00", capacity: 50, registrationRequired: true, registrationDeadline: future(20), cost: "500", status: "planned", imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400", isArchived: false, archivedAt: null, maxParticipants: 50, createdBy: "admin", isActive: true, createdAt: d(20), updatedAt: now },
      { id: 4, title: "Annual General Meeting", description: "Yearly planning and review meeting for all senior devotees.", eventType: "meeting", location: "Main Sabha Hall, Ahmedabad", startDate: future(45), endDate: future(45), startTime: "10:00", endTime: "13:00", capacity: 100, registrationRequired: true, registrationDeadline: future(40), cost: "0", status: "planned", imageUrl: null, isArchived: false, archivedAt: null, maxParticipants: 100, createdBy: "admin", isActive: true, createdAt: d(5), updatedAt: now },
      { id: 5, title: "Guru Purnima Celebration", description: "Celebration of Guru Purnima with special puja and discourse.", eventType: "festival", location: "Main Sabha Hall, Ahmedabad", startDate: d(10), endDate: d(10), startTime: "07:00", endTime: "12:00", capacity: 300, registrationRequired: false, registrationDeadline: null, cost: "0", status: "completed", imageUrl: "https://images.unsplash.com/photo-1517217568890-f2a4c6beb4e7?w=400", isArchived: false, archivedAt: null, maxParticipants: 300, createdBy: "admin", isActive: true, createdAt: d(60), updatedAt: d(10) },
      { id: 6, title: "Monthly Sabha - June", description: "Monthly devotional assembly.", eventType: "satsang", location: "Community Center, Surat", startDate: d(30), endDate: d(30), startTime: "09:00", endTime: "11:00", capacity: 200, registrationRequired: false, registrationDeadline: null, cost: "0", status: "completed", imageUrl: null, isArchived: true, archivedAt: d(29), maxParticipants: 200, createdBy: "admin", isActive: true, createdAt: d(60), updatedAt: d(29) },
    ];
    sampleEvents.forEach(e => { this.events.set(e.id, e); this.counters.events = Math.max(this.counters.events, e.id + 1); });

    // ─── ATTENDANCE ───────────────────────────────────────────────────
    const sampleAttendance: Attendance[] = [];
    let attId = 1;
    // Past events attendance for devotees 1-10
    const pastEventIds = [5, 6];
    const allDevoteeIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    pastEventIds.forEach(evId => {
      allDevoteeIds.forEach(dvId => {
        if (Math.random() > 0.2) {
          sampleAttendance.push({ id: attId++, devoteeId: dvId, eventId: evId, attendanceDate: evId === 5 ? d(10) : d(30), status: "present", checkInTime: "09:15", checkOutTime: "11:45", notes: null, markedBy: "admin", createdAt: d(evId === 5 ? 10 : 30), updatedAt: now });
        }
      });
    });
    // Historical attendance for months - for devotee 1 (Ramesh) to show trends
    for (let month = 1; month <= 12; month++) {
      const dt = new Date(now); dt.setMonth(dt.getMonth() - month);
      [1, 2, 3].forEach(evPerMonth => {
        const dt2 = new Date(dt); dt2.setDate(evPerMonth * 7);
        sampleAttendance.push({ id: attId++, devoteeId: 1, eventId: 5, attendanceDate: dt2, status: Math.random() > 0.15 ? "present" : "absent", checkInTime: "09:00", checkOutTime: "11:30", notes: null, markedBy: "admin", createdAt: dt2, updatedAt: dt2 });
      });
    }
    sampleAttendance.forEach(a => { this.attendance.set(a.id, a); this.counters.attendance = Math.max(this.counters.attendance, a.id + 1); });

    // ─── DONATIONS ────────────────────────────────────────────────────
    const sampleDonations: Donation[] = [];
    let donId = 1;
    const donTypes = ["Seva", "Festival Fund", "Building Fund", "Anna Seva", "General"];
    // Donations for devotee 1 (Ramesh) over 12 months for trends
    for (let month = 0; month <= 11; month++) {
      const dt = new Date(now); dt.setMonth(dt.getMonth() - month);
      const amount = (Math.floor(Math.random() * 5) + 1) * 500;
      sampleDonations.push({ id: donId++, devoteeId: 1, amount: String(amount), donationType: donTypes[month % donTypes.length], donationDate: dt, paymentMethod: "Cash", reference: `DON-${1000 + donId}`, notes: null, anonymousDonation: false, isActive: true, createdAt: dt, updatedAt: dt });
    }
    // Donations for devotee 5 (Suresh - major donor)
    for (let month = 0; month <= 11; month++) {
      const dt = new Date(now); dt.setMonth(dt.getMonth() - month);
      const amount = (Math.floor(Math.random() * 10) + 5) * 1000;
      sampleDonations.push({ id: donId++, devoteeId: 5, amount: String(amount), donationType: donTypes[month % donTypes.length], donationDate: dt, paymentMethod: month % 3 === 0 ? "Cheque" : "Online", reference: `DON-${2000 + donId}`, notes: null, anonymousDonation: false, isActive: true, createdAt: dt, updatedAt: dt });
    }
    // Some for other devotees
    [2, 6, 8, 9].forEach(dvId => {
      for (let i = 0; i < 4; i++) {
        const dt = d(i * 90);
        sampleDonations.push({ id: donId++, devoteeId: dvId, amount: String((Math.floor(Math.random() * 5) + 1) * 500), donationType: donTypes[i % donTypes.length], donationDate: dt, paymentMethod: "Cash", reference: `DON-${3000 + donId}`, notes: null, anonymousDonation: false, isActive: true, createdAt: dt, updatedAt: dt });
      }
    });
    sampleDonations.forEach(dn => { this.donations.set(dn.id, dn); this.counters.donations = Math.max(this.counters.donations, dn.id + 1); });

    // ─── VOLUNTEERING ─────────────────────────────────────────────────
    const sampleVolunteering: Volunteering[] = [];
    let volId = 1;
    const volActivities = ["Event Setup", "Prasad Distribution", "Registration Desk", "Kirtan Support", "Decoration", "Kitchen Seva", "Children's Program"];
    // Volunteering for devotee 1 over 12 months
    for (let month = 0; month <= 11; month++) {
      const dt = new Date(now); dt.setMonth(dt.getMonth() - month);
      const actCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < actCount; i++) {
        sampleVolunteering.push({ id: volId++, devoteeId: 1, activityType: volActivities[(month + i) % volActivities.length], activityDate: dt, hours: Math.floor(Math.random() * 4) + 2, description: "Regular seva work", status: "completed", supervisorId: 8, notes: null, isActive: true, createdAt: dt, updatedAt: dt });
      }
    }
    // Volunteering for other devotees
    [2, 3, 5, 6, 7, 8, 9].forEach(dvId => {
      for (let i = 0; i < 5; i++) {
        const dt = d(i * 60);
        sampleVolunteering.push({ id: volId++, devoteeId: dvId, activityType: volActivities[i % volActivities.length], activityDate: dt, hours: Math.floor(Math.random() * 4) + 1, description: "Seva activity", status: "completed", supervisorId: 8, notes: null, isActive: true, createdAt: dt, updatedAt: dt });
      }
    });
    sampleVolunteering.forEach(v => { this.volunteering.set(v.id, v); this.counters.volunteering = Math.max(this.counters.volunteering, v.id + 1); });

    // ─── MANDALS ──────────────────────────────────────────────────────
    const sampleMandals: Mandal[] = [
      { id: 1, name: "Ahmedabad Central Mandal", code: "ACM001", contactPerson: "Ramesh Sharma", contactPhone: "9876543210", createdAt: d(500), updatedAt: now },
      { id: 2, name: "Surat Mandal", code: "SM002", contactPerson: "Suresh Patel", contactPhone: "9876543220", createdAt: d(400), updatedAt: now },
    ];
    sampleMandals.forEach(m => { this.mandals.set(m.id, m); this.counters.mandals = Math.max(this.counters.mandals, m.id + 1); });

    // ─── SABHA LOCATIONS ──────────────────────────────────────────────
    const sampleLocations: SabhaLocation[] = [
      { id: 1, name: "Main Sabha Hall", address: "123 Main Street, Ahmedabad", zipCode: "380001", facilities: ["Audio System", "AC", "Parking", "Kitchen"], createdAt: d(500), updatedAt: now },
      { id: 2, name: "Community Center Surat", address: "45 Krishna Lane, Surat", zipCode: "395001", facilities: ["Audio System", "Projection", "Parking"], createdAt: d(300), updatedAt: now },
    ];
    sampleLocations.forEach(l => { this.sabhaLocations.set(l.id, l); this.counters.sabhaLocations = Math.max(this.counters.sabhaLocations, l.id + 1); });
  }

  // Helper: get devotees by family ID
  async getDevoteesByFamily(familyId: number): Promise<Devotee[]> {
    return Array.from(this.devotees.values()).filter(d => d.familyId === familyId);
  }

  // Helper: archive an event
  async archiveEvent(id: number): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    const updated = { ...event, isArchived: true, archivedAt: new Date(), updatedAt: new Date() };
    this.events.set(id, updated as Event);
    return updated as Event;
  }

  // Helper: auto-archive past events
  async autoArchivePastEvents(): Promise<number> {
    const now = new Date();
    let count = 0;
    this.events.forEach((event, id) => {
      if (!event.isArchived && event.endDate && new Date(event.endDate) < now) {
        const updated = { ...event, isArchived: true, archivedAt: now, updatedAt: now };
        this.events.set(id, updated as Event);
        count++;
      }
    });
    return count;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = new Date();
    const user: User = {
      id: userData.id,
      role: userData.role || "user",
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      isActive: userData.isActive ?? true,
      createdAt: this.users.get(userData.id)?.createdAt || now,
      updatedAt: now,
    };
    this.users.set(userData.id, user);
    return user;
  }

  // Devotee operations
  async getDevotees(): Promise<Devotee[]> {
    return Array.from(this.devotees.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getDevotee(id: number): Promise<Devotee | undefined> {
    return this.devotees.get(id);
  }

  async createDevotee(devoteeData: InsertDevotee): Promise<Devotee> {
    const now = new Date();
    const id = this.counters.devotees++;
    const devotee: Devotee = {
      id,
      devoteeId: devoteeData.devoteeId,
      firstName: devoteeData.firstName,
      lastName: devoteeData.lastName,
      email: devoteeData.email || null,
      phone: devoteeData.phone || null,
      whatsappNumber: devoteeData.whatsappNumber || null,
      dateOfBirth: devoteeData.dateOfBirth || null,
      gender: devoteeData.gender || null,
      address: devoteeData.address || null,
      city: devoteeData.city || null,
      state: devoteeData.state || null,
      pincode: devoteeData.pincode || null,
      country: devoteeData.country || null,
      occupation: devoteeData.occupation || null,
      spiritualLevel: devoteeData.spiritualLevel || null,
      joinDate: devoteeData.joinDate || null,
      mentorId: devoteeData.mentorId || null,
      familyId: devoteeData.familyId || null,
      profileImage: devoteeData.profileImage || null,
      notes: devoteeData.notes || null,
      specialSkills: devoteeData.specialSkills || null,
      previousExperience: devoteeData.previousExperience || null,
      emergencyContact: devoteeData.emergencyContact || null,
      emergencyPhone: devoteeData.emergencyPhone || null,
      medicalConditions: devoteeData.medicalConditions || null,
      dietaryPreferences: devoteeData.dietaryPreferences || null,
      isActive: devoteeData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.devotees.set(id, devotee);
    return devotee;
  }

  async updateDevotee(id: number, devoteeData: Partial<InsertDevotee>): Promise<Devotee> {
    const existingDevotee = this.devotees.get(id);
    if (!existingDevotee) {
      throw new Error(`Devotee with id ${id} not found`);
    }
    const updatedDevotee: Devotee = {
      ...existingDevotee,
      ...devoteeData,
      updatedAt: new Date(),
    };
    this.devotees.set(id, updatedDevotee);
    return updatedDevotee;
  }

  async deleteDevotee(id: number): Promise<boolean> {
    return this.devotees.delete(id);
  }

  // Family operations
  async getFamilies(): Promise<Family[]> {
    return Array.from(this.families.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getFamily(id: number): Promise<Family | undefined> {
    return this.families.get(id);
  }

  async createFamily(familyData: InsertFamily): Promise<Family> {
    const now = new Date();
    const id = this.counters.families++;
    const family: Family = {
      id,
      familyName: familyData.familyName,
      headOfFamily: familyData.headOfFamily || null,
      address: familyData.address || null,
      city: familyData.city || null,
      state: familyData.state || null,
      pincode: familyData.pincode || null,
      country: familyData.country || null,
      phone: familyData.phone || null,
      email: familyData.email || null,
      totalMembers: familyData.totalMembers || null,
      emergencyContact: familyData.emergencyContact || null,
      notes: familyData.notes || null,
      isActive: familyData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.families.set(id, family);
    return family;
  }

  async updateFamily(id: number, familyData: Partial<InsertFamily>): Promise<Family> {
    const existingFamily = this.families.get(id);
    if (!existingFamily) {
      throw new Error(`Family with id ${id} not found`);
    }
    const updatedFamily: Family = {
      ...existingFamily,
      ...familyData,
      updatedAt: new Date(),
    };
    this.families.set(id, updatedFamily);
    return updatedFamily;
  }

  async deleteFamily(id: number): Promise<boolean> {
    return this.families.delete(id);
  }

  // Mentor operations
  async getMentors(): Promise<Mentor[]> {
    return Array.from(this.mentors.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getMentor(id: number): Promise<Mentor | undefined> {
    return this.mentors.get(id);
  }

  async createMentor(mentorData: InsertMentor): Promise<Mentor> {
    const now = new Date();
    const id = this.counters.mentors++;
    const mentor: Mentor = {
      id,
      devoteeId: mentorData.devoteeId,
      specialization: mentorData.specialization || null,
      experience: mentorData.experience || null,
      qualifications: mentorData.qualifications || null,
      availableHours: mentorData.availableHours || null,
      contactPreference: mentorData.contactPreference || null,
      maxMentees: mentorData.maxMentees || null,
      currentMentees: mentorData.currentMentees || null,
      isActive: mentorData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.mentors.set(id, mentor);
    return mentor;
  }

  async updateMentor(id: number, mentorData: Partial<InsertMentor>): Promise<Mentor> {
    const existingMentor = this.mentors.get(id);
    if (!existingMentor) {
      throw new Error(`Mentor with id ${id} not found`);
    }
    const updatedMentor: Mentor = {
      ...existingMentor,
      ...mentorData,
      updatedAt: new Date(),
    };
    this.mentors.set(id, updatedMentor);
    return updatedMentor;
  }

  async deleteMentor(id: number): Promise<boolean> {
    return this.mentors.delete(id);
  }

  // Attendance operations
  async getAttendance(devoteeId?: number, eventId?: number): Promise<Attendance[]> {
    let result = Array.from(this.attendance.values());
    
    if (devoteeId) {
      result = result.filter(a => a.devoteeId === devoteeId);
    }
    
    if (eventId) {
      result = result.filter(a => a.eventId === eventId);
    }
    
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const now = new Date();
    const id = this.counters.attendance++;
    const attendance: Attendance = {
      id,
      ...attendanceData,
      createdAt: now,
      updatedAt: now,
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, attendanceData: Partial<InsertAttendance>): Promise<Attendance> {
    const existingAttendance = this.attendance.get(id);
    if (!existingAttendance) {
      throw new Error(`Attendance record with id ${id} not found`);
    }
    const updatedAttendance: Attendance = {
      ...existingAttendance,
      ...attendanceData,
      updatedAt: new Date(),
    };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }

  async deleteAttendance(id: number): Promise<boolean> {
    return this.attendance.delete(id);
  }

  // Donation operations
  async getDonations(devoteeId?: number): Promise<Donation[]> {
    let result = Array.from(this.donations.values());
    
    if (devoteeId) {
      result = result.filter(d => d.devoteeId === devoteeId);
    }
    
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createDonation(donationData: InsertDonation): Promise<Donation> {
    const now = new Date();
    const id = this.counters.donations++;
    const donation: Donation = {
      id,
      ...donationData,
      createdAt: now,
      updatedAt: now,
    };
    this.donations.set(id, donation);
    return donation;
  }

  async updateDonation(id: number, donationData: Partial<InsertDonation>): Promise<Donation> {
    const existingDonation = this.donations.get(id);
    if (!existingDonation) {
      throw new Error(`Donation with id ${id} not found`);
    }
    const updatedDonation: Donation = {
      ...existingDonation,
      ...donationData,
      updatedAt: new Date(),
    };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  async deleteDonation(id: number): Promise<boolean> {
    return this.donations.delete(id);
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const now = new Date();
    const id = this.counters.events++;
    const event: Event = {
      id,
      title: eventData.title,
      description: eventData.description || null,
      eventType: eventData.eventType,
      location: eventData.location || null,
      startDate: eventData.startDate,
      endDate: eventData.endDate || null,
      startTime: eventData.startTime || null,
      endTime: eventData.endTime || null,
      capacity: eventData.capacity || null,
      registrationRequired: eventData.registrationRequired || false,
      registrationDeadline: eventData.registrationDeadline || null,
      cost: eventData.cost || null,
      status: eventData.status || "planned",
      imageUrl: (eventData as any).imageUrl || null,
      isArchived: (eventData as any).isArchived || false,
      archivedAt: (eventData as any).archivedAt || null,
      maxParticipants: (eventData as any).maxParticipants || eventData.capacity || null,
      createdBy: eventData.createdBy || null,
      isActive: eventData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventData: Partial<InsertEvent>): Promise<Event> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) {
      throw new Error(`Event with id ${id} not found`);
    }
    const updatedEvent: Event = {
      ...existingEvent,
      ...eventData,
      updatedAt: new Date(),
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Volunteering operations
  async getVolunteering(devoteeId?: number): Promise<Volunteering[]> {
    let result = Array.from(this.volunteering.values());
    
    if (devoteeId) {
      result = result.filter(v => v.devoteeId === devoteeId);
    }
    
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createVolunteering(volunteeringData: InsertVolunteering): Promise<Volunteering> {
    const now = new Date();
    const id = this.counters.volunteering++;
    const volunteering: Volunteering = {
      id,
      ...volunteeringData,
      createdAt: now,
      updatedAt: now,
    };
    this.volunteering.set(id, volunteering);
    return volunteering;
  }

  async updateVolunteering(id: number, volunteeringData: Partial<InsertVolunteering>): Promise<Volunteering> {
    const existingVolunteering = this.volunteering.get(id);
    if (!existingVolunteering) {
      throw new Error(`Volunteering record with id ${id} not found`);
    }
    const updatedVolunteering: Volunteering = {
      ...existingVolunteering,
      ...volunteeringData,
      updatedAt: new Date(),
    };
    this.volunteering.set(id, updatedVolunteering);
    return updatedVolunteering;
  }

  async deleteVolunteering(id: number): Promise<boolean> {
    return this.volunteering.delete(id);
  }

  // Group operations
  async getGroups(): Promise<Group[]> {
    return Array.from(this.groups.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getGroup(id: number): Promise<Group | undefined> {
    return this.groups.get(id);
  }

  async createGroup(groupData: InsertGroup): Promise<Group> {
    const now = new Date();
    const id = this.counters.groups++;
    const group: Group = {
      id,
      groupName: groupData.groupName,
      description: groupData.description || null,
      groupType: groupData.groupType,
      capacity: groupData.capacity || null,
      currentMembers: groupData.currentMembers || 0,
      location: groupData.location || null,
      meetingSchedule: groupData.meetingSchedule || null,
      leaderId: groupData.leaderId || null,
      requirements: groupData.requirements || null,
      customFields: groupData.customFields || null,
      createdBy: groupData.createdBy || null,
      isActive: groupData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    this.groups.set(id, group);
    return group;
  }

  async updateGroup(id: number, groupData: Partial<InsertGroup>): Promise<Group> {
    const existingGroup = this.groups.get(id);
    if (!existingGroup) {
      throw new Error(`Group with id ${id} not found`);
    }
    const updatedGroup: Group = {
      ...existingGroup,
      ...groupData,
      updatedAt: new Date(),
    };
    this.groups.set(id, updatedGroup);
    return updatedGroup;
  }

  async deleteGroup(id: number): Promise<boolean> {
    return this.groups.delete(id);
  }

  // Group entries operations
  async getGroupEntries(groupId?: number): Promise<GroupEntry[]> {
    let result = Array.from(this.groupEntries.values());
    
    if (groupId) {
      result = result.filter(ge => ge.groupId === groupId);
    }
    
    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createGroupEntry(entryData: InsertGroupEntry): Promise<GroupEntry> {
    const now = new Date();
    const id = this.counters.groupEntries++;
    const entry: GroupEntry = {
      id,
      ...entryData,
      createdAt: now,
      updatedAt: now,
    };
    this.groupEntries.set(id, entry);
    return entry;
  }

  async updateGroupEntry(id: number, entryData: Partial<InsertGroupEntry>): Promise<GroupEntry> {
    const existingEntry = this.groupEntries.get(id);
    if (!existingEntry) {
      throw new Error(`Group entry with id ${id} not found`);
    }
    const updatedEntry: GroupEntry = {
      ...existingEntry,
      ...entryData,
      updatedAt: new Date(),
    };
    this.groupEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteGroupEntry(id: number): Promise<boolean> {
    return this.groupEntries.delete(id);
  }

  // Mandal operations
  async getMandals(): Promise<Mandal[]> {
    return Array.from(this.mandals.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createMandal(mandalData: InsertMandal): Promise<Mandal> {
    const now = new Date();
    const id = this.counters.mandals++;
    const mandal: Mandal = {
      id,
      ...mandalData,
      createdAt: now,
      updatedAt: now,
    };
    this.mandals.set(id, mandal);
    return mandal;
  }

  // Sabha location operations
  async getSabhaLocations(): Promise<SabhaLocation[]> {
    return Array.from(this.sabhaLocations.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createSabhaLocation(locationData: InsertSabhaLocation): Promise<SabhaLocation> {
    const now = new Date();
    const id = this.counters.sabhaLocations++;
    const location: SabhaLocation = {
      id,
      ...locationData,
      createdAt: now,
      updatedAt: now,
    };
    this.sabhaLocations.set(id, location);
    return location;
  }

  // Dashboard operations
  async getDashboardLayouts(userId: string): Promise<DashboardLayout[]> {
    return Array.from(this.dashboardLayouts.values())
      .filter(layout => layout.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createDashboardLayout(layoutData: InsertDashboardLayout): Promise<DashboardLayout> {
    const now = new Date();
    const id = this.counters.dashboardLayouts++;
    const layout: DashboardLayout = {
      id,
      ...layoutData,
      createdAt: now,
      updatedAt: now,
    };
    this.dashboardLayouts.set(id, layout);
    return layout;
  }

  async updateDashboardLayout(id: number, layoutData: Partial<InsertDashboardLayout>): Promise<DashboardLayout> {
    const existingLayout = this.dashboardLayouts.get(id);
    if (!existingLayout) {
      throw new Error(`Dashboard layout with id ${id} not found`);
    }
    const updatedLayout: DashboardLayout = {
      ...existingLayout,
      ...layoutData,
      updatedAt: new Date(),
    };
    this.dashboardLayouts.set(id, updatedLayout);
    return updatedLayout;
  }

  async deleteDashboardLayout(id: number): Promise<boolean> {
    return this.dashboardLayouts.delete(id);
  }

  // User preferences operations
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(userId);
  }

  async upsertUserPreferences(preferencesData: InsertUserPreferences): Promise<UserPreferences> {
    const now = new Date();
    const preferences: UserPreferences = {
      ...preferencesData,
      createdAt: this.userPreferences.get(preferencesData.userId)?.createdAt || now,
      updatedAt: now,
    };
    this.userPreferences.set(preferencesData.userId, preferences);
    return preferences;
  }

  // Analytics operations
  async getStats(): Promise<{
    totalDevotees: number;
    activeFamilies: number;
    totalDonations: number;
    avgAttendance: number;
  }> {
    const totalDevotees = this.devotees.size;
    const activeFamilies = this.families.size;
    
    const donations = Array.from(this.donations.values());
    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
    
    const attendanceRecords = Array.from(this.attendance.values());
    const avgAttendance = attendanceRecords.length > 0 
      ? attendanceRecords.length / Math.max(this.events.size, 1) 
      : 0;

    return {
      totalDevotees,
      activeFamilies,
      totalDonations,
      avgAttendance: Math.round(avgAttendance * 100) / 100,
    };
  }
}