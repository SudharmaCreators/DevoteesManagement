
import { storage } from "./storage";
import { db } from "./db";
import { devotees, families, mentors, events, attendance, donations, eventParticipation, volunteering, groupMemberships, groupEntries, mandals, sabhaLocations, groups } from "@shared/schema";
import { count } from "drizzle-orm";

async function getCount(table: any): Promise<number> {
  const [result] = await db.select({ cnt: count() }).from(table);
  return Number(result?.cnt ?? 0);
}

export async function seedDemoData() {
  try {
    // ── 1. Mandals (reference data) ───────────────────────────────────────────
    const mandalCount = await getCount(mandals);
    if (mandalCount === 0) {
      const mandalData = [
        { name: "Shri Ayodhya Mandal", hindiName: "श्री अयोध्या मंडल", code: "AY" },
        { name: "Shri Dwarkadhish Mandal", hindiName: "श्री द्वारकाधीश मंडल", code: "DW" },
        { name: "Shri Ganpati Mandal", hindiName: "श्री गणपति मंडल", code: "GP" },
        { name: "Shri Kalika Mandal", hindiName: "श्री कालिका मंडल", code: "KL" },
        { name: "Shri Kashi Varanasi Mandal", hindiName: "श्री काशी वाराणसी मंडल", code: "KV" },
        { name: "Shri Khatushyam Mandal", hindiName: "श्री खातूश्याम जी मंडल", code: "KS" },
        { name: "Shri Mahakaleswar Mandal", hindiName: "श्री महाकालेश्वर मंडल", code: "MK" },
        { name: "Shri Maharatnapur Mandal", hindiName: "श्री महारत्नपुर मंडल", code: "MR" },
        { name: "Shri Mathura Gop Vrindavan Mandal", hindiName: "श्री मथुरा गोप वृन्दावन मण्डल", code: "MG" },
        { name: "Shri Rameshwaram Mandal", hindiName: "श्री रामेश्वरम मंडल", code: "RM" },
        { name: "Nav Braj Bhoomi Mandal", hindiName: "नव ब्रज भूमि मंडल", code: "NB" },
        { name: "Odiya Mandal", hindiName: "ओडिया मंडल", code: "OD" },
        { name: "Sagar Paar", hindiName: "सागर पार", code: "SP" },
        { name: "Other", hindiName: "अन्य", code: "OT" },
        { name: "None", hindiName: "कोई नहीं", code: "NN" },
      ];
      for (const mandal of mandalData) {
        await storage.createMandal({ ...mandal, description: `Mandal group for ${mandal.name}`, isActive: true });
      }
    }

    // ── 2. Sabha Locations (reference data) ───────────────────────────────────
    const sabhaCount = await getCount(sabhaLocations);
    if (sabhaCount === 0) {
      const locationData = [
        { name: "Mumbai Central Sabha", address: "Mumbai Central, Maharashtra", city: "Mumbai", state: "Maharashtra" },
        { name: "Delhi Satsang Bhawan", address: "Karol Bagh, New Delhi", city: "Delhi", state: "Delhi" },
        { name: "Bangalore Ashram", address: "Whitefield, Bangalore", city: "Bangalore", state: "Karnataka" },
        { name: "Pune Sabha Griha", address: "Shivaji Nagar, Pune", city: "Pune", state: "Maharashtra" },
        { name: "Hyderabad Center", address: "Banjara Hills, Hyderabad", city: "Hyderabad", state: "Telangana" },
        { name: "Chennai Seva Kendra", address: "T. Nagar, Chennai", city: "Chennai", state: "Tamil Nadu" },
        { name: "Kolkata Satsang Hall", address: "Salt Lake, Kolkata", city: "Kolkata", state: "West Bengal" },
        { name: "Ahmedabad Dharmashala", address: "Navrangpura, Ahmedabad", city: "Ahmedabad", state: "Gujarat" },
        { name: "Jaipur Ashram", address: "C-Scheme, Jaipur", city: "Jaipur", state: "Rajasthan" },
        { name: "Lucknow Satsang Bhawan", address: "Hazratganj, Lucknow", city: "Lucknow", state: "Uttar Pradesh" },
      ];
      for (const loc of locationData) {
        await storage.createSabhaLocation({ ...loc, isActive: true });
      }
    }

    // ── 3. Groups ─────────────────────────────────────────────────────────────
    const groupCount = await getCount(groups);
    if (groupCount === 0) {
      const defaultGroups = [
        {
          groupName: "Families",
          groupType: "family",
          description: "Family groups management",
          customFields: [
            { id: "familyName", name: "Family Name", type: "text", maxLength: 50, required: true },
            { id: "headOfFamily", name: "Head of Family", type: "text", maxLength: 50, required: true },
            { id: "totalMembers", name: "Total Members", type: "number", required: false },
            { id: "fullAddress", name: "Full Address", type: "textarea", maxLength: 100, required: false },
            { id: "mobileNumber", name: "Mobile Number", type: "number", maxLength: 13, required: false },
          ],
          isActive: true,
        },
        {
          groupName: "Mentors",
          groupType: "mentor",
          description: "Spiritual mentors and guides",
          customFields: [
            { id: "firstName", name: "First Name", type: "text", maxLength: 20, required: true },
            { id: "surname", name: "Surname", type: "text", maxLength: 20, required: true },
            { id: "specialization", name: "Specialization", type: "text", required: false },
            { id: "experience", name: "Experience (Years)", type: "number", required: false },
            { id: "mobileNumber", name: "Mobile Number", type: "number", maxLength: 13, required: false },
            { id: "maxMentees", name: "Max Mentees", type: "number", required: false },
          ],
          isActive: true,
        },
        {
          groupName: "Volunteers",
          groupType: "volunteer",
          description: "Active volunteers and seva workers",
          customFields: [
            { id: "firstName", name: "First Name", type: "text", maxLength: 20, required: true },
            { id: "surname", name: "Surname", type: "text", maxLength: 20, required: true },
            { id: "mobileNumber", name: "Mobile Number", type: "number", maxLength: 13, required: false },
            { id: "volunteeringActivities", name: "Volunteering Activities", type: "textarea", required: false },
            { id: "availableHours", name: "Available Hours", type: "text", required: false },
            { id: "specialSkills", name: "Special Skills", type: "textarea", required: false },
          ],
          isActive: true,
        },
        {
          groupName: "Sabha List",
          groupType: "sabha",
          description: "Sabha attendees and participants",
          customFields: [
            { id: "firstName", name: "First Name", type: "text", maxLength: 20, required: true },
            { id: "surname", name: "Surname", type: "text", maxLength: 20, required: true },
            { id: "mobileNumber", name: "Mobile Number", type: "number", maxLength: 13, required: false },
            { id: "dateOfJoining", name: "Date of Joining", type: "date", required: false },
          ],
          isActive: true,
        },
      ];
      for (const group of defaultGroups) {
        await storage.createGroup(group);
      }
    }

    // ── 4. Families (50) ──────────────────────────────────────────────────────
    const familyCount = await getCount(families);
    if (familyCount === 0) {
      const familyData = [
        { familyName: "Sharma Family", city: "Mumbai", state: "Maharashtra", phone: "9876541001", email: "sharma.family@email.com", totalMembers: 4, address: "A-12, Sector 7, Mumbai" },
        { familyName: "Gupta Family", city: "Delhi", state: "Delhi", phone: "9876541002", email: "gupta.family@email.com", totalMembers: 5, address: "B-34, Lajpat Nagar, Delhi" },
        { familyName: "Patel Family", city: "Ahmedabad", state: "Gujarat", phone: "9876541003", email: "patel.family@email.com", totalMembers: 3, address: "C-56, Navrangpura, Ahmedabad" },
        { familyName: "Singh Family", city: "Jaipur", state: "Rajasthan", phone: "9876541004", email: "singh.family@email.com", totalMembers: 6, address: "D-78, C-Scheme, Jaipur" },
        { familyName: "Verma Family", city: "Lucknow", state: "Uttar Pradesh", phone: "9876541005", email: "verma.family@email.com", totalMembers: 4, address: "E-90, Hazratganj, Lucknow" },
        { familyName: "Agarwal Family", city: "Kolkata", state: "West Bengal", phone: "9876541006", email: "agarwal.family@email.com", totalMembers: 5, address: "F-11, Salt Lake, Kolkata" },
        { familyName: "Mehta Family", city: "Pune", state: "Maharashtra", phone: "9876541007", email: "mehta.family@email.com", totalMembers: 3, address: "G-22, Shivaji Nagar, Pune" },
        { familyName: "Joshi Family", city: "Bangalore", state: "Karnataka", phone: "9876541008", email: "joshi.family@email.com", totalMembers: 4, address: "H-33, Whitefield, Bangalore" },
        { familyName: "Yadav Family", city: "Hyderabad", state: "Telangana", phone: "9876541009", email: "yadav.family@email.com", totalMembers: 7, address: "I-44, Banjara Hills, Hyderabad" },
        { familyName: "Mishra Family", city: "Varanasi", state: "Uttar Pradesh", phone: "9876541010", email: "mishra.family@email.com", totalMembers: 5, address: "J-55, Lanka, Varanasi" },
        { familyName: "Tiwari Family", city: "Allahabad", state: "Uttar Pradesh", phone: "9876541011", email: "tiwari.family@email.com", totalMembers: 4, address: "K-66, Civil Lines, Allahabad" },
        { familyName: "Pandey Family", city: "Patna", state: "Bihar", phone: "9876541012", email: "pandey.family@email.com", totalMembers: 6, address: "L-77, Boring Road, Patna" },
        { familyName: "Dubey Family", city: "Bhopal", state: "Madhya Pradesh", phone: "9876541013", email: "dubey.family@email.com", totalMembers: 3, address: "M-88, Arera Colony, Bhopal" },
        { familyName: "Chaturvedi Family", city: "Nagpur", state: "Maharashtra", phone: "9876541014", email: "chaturvedi.family@email.com", totalMembers: 4, address: "N-99, Dharampeth, Nagpur" },
        { familyName: "Srivastava Family", city: "Kanpur", state: "Uttar Pradesh", phone: "9876541015", email: "srivastava.family@email.com", totalMembers: 5, address: "O-10, Kidwai Nagar, Kanpur" },
        { familyName: "Dixit Family", city: "Indore", state: "Madhya Pradesh", phone: "9876541016", email: "dixit.family@email.com", totalMembers: 3, address: "P-21, Vijay Nagar, Indore" },
        { familyName: "Bajpai Family", city: "Agra", state: "Uttar Pradesh", phone: "9876541017", email: "bajpai.family@email.com", totalMembers: 4, address: "Q-32, Taj Nagri, Agra" },
        { familyName: "Saxena Family", city: "Surat", state: "Gujarat", phone: "9876541018", email: "saxena.family@email.com", totalMembers: 5, address: "R-43, Athwa, Surat" },
        { familyName: "Shukla Family", city: "Vadodara", state: "Gujarat", phone: "9876541019", email: "shukla.family@email.com", totalMembers: 4, address: "S-54, Alkapuri, Vadodara" },
        { familyName: "Tripathi Family", city: "Rajkot", state: "Gujarat", phone: "9876541020", email: "tripathi.family@email.com", totalMembers: 3, address: "T-65, University Road, Rajkot" },
        { familyName: "Awasthi Family", city: "Nashik", state: "Maharashtra", phone: "9876541021", email: "awasthi.family@email.com", totalMembers: 4, address: "U-76, Gangapur Road, Nashik" },
        { familyName: "Kesharwani Family", city: "Raipur", state: "Chhattisgarh", phone: "9876541022", email: "kesharwani.family@email.com", totalMembers: 5, address: "V-87, Pandri, Raipur" },
        { familyName: "Upadhyay Family", city: "Coimbatore", state: "Tamil Nadu", phone: "9876541023", email: "upadhyay.family@email.com", totalMembers: 3, address: "W-98, RS Puram, Coimbatore" },
        { familyName: "Maurya Family", city: "Madurai", state: "Tamil Nadu", phone: "9876541024", email: "maurya.family@email.com", totalMembers: 6, address: "X-19, Tallakulam, Madurai" },
        { familyName: "Bajaj Family", city: "Vijayawada", state: "Andhra Pradesh", phone: "9876541025", email: "bajaj.family@email.com", totalMembers: 4, address: "Y-20, Benz Circle, Vijayawada" },
        { familyName: "Goyal Family", city: "Visakhapatnam", state: "Andhra Pradesh", phone: "9876541026", email: "goyal.family@email.com", totalMembers: 5, address: "Z-31, MVP Colony, Visakhapatnam" },
        { familyName: "Kapoor Family", city: "Amritsar", state: "Punjab", phone: "9876541027", email: "kapoor.family@email.com", totalMembers: 4, address: "AA-42, Lawrence Road, Amritsar" },
        { familyName: "Malhotra Family", city: "Ludhiana", state: "Punjab", phone: "9876541028", email: "malhotra.family@email.com", totalMembers: 3, address: "BB-53, Model Town, Ludhiana" },
        { familyName: "Khanna Family", city: "Chandigarh", state: "Chandigarh", phone: "9876541029", email: "khanna.family@email.com", totalMembers: 5, address: "CC-64, Sector 35, Chandigarh" },
        { familyName: "Batra Family", city: "Dehradun", state: "Uttarakhand", phone: "9876541030", email: "batra.family@email.com", totalMembers: 4, address: "DD-75, Rajpur Road, Dehradun" },
        { familyName: "Anand Family", city: "Shimla", state: "Himachal Pradesh", phone: "9876541031", email: "anand.family@email.com", totalMembers: 3, address: "EE-86, Mall Road, Shimla" },
        { familyName: "Sood Family", city: "Jammu", state: "Jammu & Kashmir", phone: "9876541032", email: "sood.family@email.com", totalMembers: 5, address: "FF-97, Gandhi Nagar, Jammu" },
        { familyName: "Bhatt Family", city: "Haridwar", state: "Uttarakhand", phone: "9876541033", email: "bhatt.family@email.com", totalMembers: 4, address: "GG-18, Jwalapur, Haridwar" },
        { familyName: "Nair Family", city: "Thiruvananthapuram", state: "Kerala", phone: "9876541034", email: "nair.family@email.com", totalMembers: 4, address: "HH-29, Pattom, Thiruvananthapuram" },
        { familyName: "Pillai Family", city: "Kochi", state: "Kerala", phone: "9876541035", email: "pillai.family@email.com", totalMembers: 5, address: "II-30, Edappally, Kochi" },
        { familyName: "Menon Family", city: "Kozhikode", state: "Kerala", phone: "9876541036", email: "menon.family@email.com", totalMembers: 3, address: "JJ-41, Palayam, Kozhikode" },
        { familyName: "Reddy Family", city: "Hyderabad", state: "Telangana", phone: "9876541037", email: "reddy.family@email.com", totalMembers: 6, address: "KK-52, Jubilee Hills, Hyderabad" },
        { familyName: "Rao Family", city: "Chennai", state: "Tamil Nadu", phone: "9876541038", email: "rao.family@email.com", totalMembers: 4, address: "LL-63, Anna Nagar, Chennai" },
        { familyName: "Iyer Family", city: "Mysuru", state: "Karnataka", phone: "9876541039", email: "iyer.family@email.com", totalMembers: 3, address: "MM-74, Saraswathipuram, Mysuru" },
        { familyName: "Das Family", city: "Bhubaneswar", state: "Odisha", phone: "9876541040", email: "das.family@email.com", totalMembers: 5, address: "NN-85, Saheed Nagar, Bhubaneswar" },
        { familyName: "Bose Family", city: "Guwahati", state: "Assam", phone: "9876541041", email: "bose.family@email.com", totalMembers: 4, address: "OO-96, Paltan Bazar, Guwahati" },
        { familyName: "Dey Family", city: "Siliguri", state: "West Bengal", phone: "9876541042", email: "dey.family@email.com", totalMembers: 3, address: "PP-17, Sevoke Road, Siliguri" },
        { familyName: "Banerjee Family", city: "Durgapur", state: "West Bengal", phone: "9876541043", email: "banerjee.family@email.com", totalMembers: 5, address: "QQ-28, City Centre, Durgapur" },
        { familyName: "Chakraborty Family", city: "Asansol", state: "West Bengal", phone: "9876541044", email: "chakraborty.family@email.com", totalMembers: 4, address: "RR-39, Court Road, Asansol" },
        { familyName: "Mukherjee Family", city: "Howrah", state: "West Bengal", phone: "9876541045", email: "mukherjee.family@email.com", totalMembers: 6, address: "SS-50, GT Road, Howrah" },
        { familyName: "Roy Family", city: "Ranchi", state: "Jharkhand", phone: "9876541046", email: "roy.family@email.com", totalMembers: 4, address: "TT-61, Lalpur, Ranchi" },
        { familyName: "Kumar Family", city: "Dhanbad", state: "Jharkhand", phone: "9876541047", email: "kumar.family@email.com", totalMembers: 3, address: "UU-72, Hirapur, Dhanbad" },
        { familyName: "Prasad Family", city: "Gaya", state: "Bihar", phone: "9876541048", email: "prasad.family@email.com", totalMembers: 5, address: "VV-83, Station Road, Gaya" },
        { familyName: "Jha Family", city: "Muzaffarpur", state: "Bihar", phone: "9876541049", email: "jha.family@email.com", totalMembers: 4, address: "WW-94, Juran Chapra, Muzaffarpur" },
        { familyName: "Thakur Family", city: "Varanasi", state: "Uttar Pradesh", phone: "9876541050", email: "thakur.family@email.com", totalMembers: 5, address: "XX-15, Sigra, Varanasi" },
      ];
      for (const fam of familyData) {
        await storage.createFamily({ ...fam, country: "India", pincode: "400001", emergencyContact: fam.phone, isActive: true });
      }
    }

    // ── 5. Devotees (50) ──────────────────────────────────────────────────────
    const devoteeCount = await getCount(devotees);
    const createdDevoteeIds: number[] = [];

    if (devoteeCount === 0) {
      const currentFamilies = await storage.getFamilies();
      const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];
      const states = ["Maharashtra", "Delhi", "Karnataka", "Maharashtra", "Telangana", "Tamil Nadu", "West Bengal", "Gujarat", "Rajasthan", "Uttar Pradesh"];
      const occupations = ["Software Engineer", "Doctor", "Teacher", "Business Owner", "Accountant", "Lawyer", "Engineer", "Professor", "Retired", "Homemaker"];
      const spiritualLevels = ["Seeker", "Practitioner", "Devotee", "Advanced Devotee", "Senior Devotee"];
      const genders = ["Male", "Female", "Male", "Male", "Female"];

      const devoteeData = [
        { firstName: "Rajesh", lastName: "Sharma", email: "rajesh.sharma@email.com", phone: "9876500001" },
        { firstName: "Priya", lastName: "Gupta", email: "priya.gupta@email.com", phone: "9876500002" },
        { firstName: "Amit", lastName: "Patel", email: "amit.patel@email.com", phone: "9876500003" },
        { firstName: "Sunita", lastName: "Singh", email: "sunita.singh@email.com", phone: "9876500004" },
        { firstName: "Vikram", lastName: "Verma", email: "vikram.verma@email.com", phone: "9876500005" },
        { firstName: "Meera", lastName: "Agarwal", email: "meera.agarwal@email.com", phone: "9876500006" },
        { firstName: "Deepak", lastName: "Mehta", email: "deepak.mehta@email.com", phone: "9876500007" },
        { firstName: "Kavita", lastName: "Joshi", email: "kavita.joshi@email.com", phone: "9876500008" },
        { firstName: "Suresh", lastName: "Yadav", email: "suresh.yadav@email.com", phone: "9876500009" },
        { firstName: "Anita", lastName: "Mishra", email: "anita.mishra@email.com", phone: "9876500010" },
        { firstName: "Ravi", lastName: "Tiwari", email: "ravi.tiwari@email.com", phone: "9876500011" },
        { firstName: "Geeta", lastName: "Pandey", email: "geeta.pandey@email.com", phone: "9876500012" },
        { firstName: "Manoj", lastName: "Dubey", email: "manoj.dubey@email.com", phone: "9876500013" },
        { firstName: "Sanjay", lastName: "Chaturvedi", email: "sanjay.chaturvedi@email.com", phone: "9876500014" },
        { firstName: "Rekha", lastName: "Srivastava", email: "rekha.srivastava@email.com", phone: "9876500015" },
        { firstName: "Anil", lastName: "Dixit", email: "anil.dixit@email.com", phone: "9876500016" },
        { firstName: "Pooja", lastName: "Bajpai", email: "pooja.bajpai@email.com", phone: "9876500017" },
        { firstName: "Rahul", lastName: "Saxena", email: "rahul.saxena@email.com", phone: "9876500018" },
        { firstName: "Nandita", lastName: "Shukla", email: "nandita.shukla@email.com", phone: "9876500019" },
        { firstName: "Ashok", lastName: "Tripathi", email: "ashok.tripathi@email.com", phone: "9876500020" },
        { firstName: "Lata", lastName: "Awasthi", email: "lata.awasthi@email.com", phone: "9876500021" },
        { firstName: "Mukesh", lastName: "Kesharwani", email: "mukesh.kesharwani@email.com", phone: "9876500022" },
        { firstName: "Usha", lastName: "Upadhyay", email: "usha.upadhyay@email.com", phone: "9876500023" },
        { firstName: "Ramesh", lastName: "Maurya", email: "ramesh.maurya@email.com", phone: "9876500024" },
        { firstName: "Shobha", lastName: "Bajaj", email: "shobha.bajaj@email.com", phone: "9876500025" },
        { firstName: "Dinesh", lastName: "Goyal", email: "dinesh.goyal@email.com", phone: "9876500026" },
        { firstName: "Asha", lastName: "Kapoor", email: "asha.kapoor@email.com", phone: "9876500027" },
        { firstName: "Naresh", lastName: "Malhotra", email: "naresh.malhotra@email.com", phone: "9876500028" },
        { firstName: "Sudha", lastName: "Khanna", email: "sudha.khanna@email.com", phone: "9876500029" },
        { firstName: "Vinod", lastName: "Batra", email: "vinod.batra@email.com", phone: "9876500030" },
        { firstName: "Seema", lastName: "Anand", email: "seema.anand@email.com", phone: "9876500031" },
        { firstName: "Harish", lastName: "Sood", email: "harish.sood@email.com", phone: "9876500032" },
        { firstName: "Kamla", lastName: "Bhatt", email: "kamla.bhatt@email.com", phone: "9876500033" },
        { firstName: "Sunil", lastName: "Nair", email: "sunil.nair@email.com", phone: "9876500034" },
        { firstName: "Radha", lastName: "Pillai", email: "radha.pillai@email.com", phone: "9876500035" },
        { firstName: "Girish", lastName: "Menon", email: "girish.menon@email.com", phone: "9876500036" },
        { firstName: "Rani", lastName: "Reddy", email: "rani.reddy@email.com", phone: "9876500037" },
        { firstName: "Ganesh", lastName: "Rao", email: "ganesh.rao@email.com", phone: "9876500038" },
        { firstName: "Saraswati", lastName: "Iyer", email: "saraswati.iyer@email.com", phone: "9876500039" },
        { firstName: "Bijoy", lastName: "Das", email: "bijoy.das@email.com", phone: "9876500040" },
        { firstName: "Mala", lastName: "Bose", email: "mala.bose@email.com", phone: "9876500041" },
        { firstName: "Tapan", lastName: "Dey", email: "tapan.dey@email.com", phone: "9876500042" },
        { firstName: "Rupa", lastName: "Banerjee", email: "rupa.banerjee@email.com", phone: "9876500043" },
        { firstName: "Subrata", lastName: "Chakraborty", email: "subrata.chakraborty@email.com", phone: "9876500044" },
        { firstName: "Madhuri", lastName: "Mukherjee", email: "madhuri.mukherjee@email.com", phone: "9876500045" },
        { firstName: "Pranab", lastName: "Roy", email: "pranab.roy@email.com", phone: "9876500046" },
        { firstName: "Lakshmi", lastName: "Kumar", email: "lakshmi.kumar@email.com", phone: "9876500047" },
        { firstName: "Govind", lastName: "Prasad", email: "govind.prasad@email.com", phone: "9876500048" },
        { firstName: "Shakuntala", lastName: "Jha", email: "shakuntala.jha@email.com", phone: "9876500049" },
        { firstName: "Mahesh", lastName: "Thakur", email: "mahesh.thakur@email.com", phone: "9876500050" },
      ];

      const baseJoinDate = new Date("2020-01-01");
      for (let i = 0; i < devoteeData.length; i++) {
        const d = devoteeData[i];
        const cityIdx = i % cities.length;
        const joinDate = new Date(baseJoinDate);
        joinDate.setMonth(joinDate.getMonth() + Math.floor(i * 0.8));
        const dob = new Date("1970-01-01");
        dob.setFullYear(1960 + (i % 35));
        dob.setMonth(i % 12);

        const created = await storage.createDevotee({
          devoteeId: `DEV${String(i + 1).padStart(4, "0")}`,
          firstName: d.firstName,
          lastName: d.lastName,
          email: d.email,
          phone: d.phone,
          whatsappNumber: d.phone,
          dateOfBirth: dob,
          gender: genders[i % genders.length],
          address: `${i + 1}, Main Street, ${cities[cityIdx]}`,
          city: cities[cityIdx],
          state: states[cityIdx],
          pincode: `4000${String(i + 1).padStart(2, "0")}`,
          country: "India",
          occupation: occupations[i % occupations.length],
          spiritualLevel: spiritualLevels[i % spiritualLevels.length],
          joinDate: joinDate,
          familyId: currentFamilies.length > 0 ? currentFamilies[i % currentFamilies.length].id : undefined,
          notes: `Devotee since ${joinDate.getFullYear()}. Active member of the community.`,
          specialSkills: ["Singing", "Cooking", "Teaching", "Driving", "Carpentry"][i % 5],
          emergencyContact: `Emergency Contact ${i + 1}`,
          emergencyPhone: `987654${String(9000 + i).padStart(4, "0")}`,
          dietaryPreferences: ["Vegetarian", "Vegan", "Jain Vegetarian"][i % 3],
          isActive: true,
        });
        createdDevoteeIds.push(created.id);
      }
    } else {
      const existing = await storage.getDevotees();
      existing.forEach(d => createdDevoteeIds.push(d.id));
    }

    // ── 6. Mentors (10) ───────────────────────────────────────────────────────
    const mentorCount = await getCount(mentors);
    const createdMentorIds: number[] = [];

    if (mentorCount === 0 && createdDevoteeIds.length >= 10) {
      const specializations = [
        "Bhagavad Gita Studies", "Vedic Mathematics", "Yoga & Meditation",
        "Sanskrit Literature", "Spiritual Counseling", "Devotional Music",
        "Ayurveda", "Vedanta Philosophy", "Temple Management", "Seva Coordination",
      ];
      const contactPrefs = ["phone", "whatsapp", "email", "in-person"];

      for (let i = 0; i < 10; i++) {
        const created = await storage.createMentor({
          devoteeId: createdDevoteeIds[i],
          specialization: specializations[i],
          experience: `${10 + i * 2} years of dedicated practice and teaching`,
          qualifications: `Graduated from ${["Vrindavan Academy", "Haridwar Gurukul", "Mathura Vidyalaya", "Varanasi Sanskrit Vishwavidyalaya", "Tirupati Devasthanam"][i % 5]}`,
          availableHours: ["Morning 6-8am", "Evening 6-8pm", "Weekends", "Tuesday & Thursday evenings", "Daily 5-7pm"][i % 5],
          contactPreference: contactPrefs[i % contactPrefs.length],
          maxMentees: 10 + i * 2,
          currentMentees: i + 1,
          isActive: true,
        });
        createdMentorIds.push(created.id);
      }

      // Assign mentors back to devotees (devotees 10-49 get a mentor)
      for (let i = 10; i < createdDevoteeIds.length; i++) {
        await storage.updateDevotee(createdDevoteeIds[i], {
          mentorId: createdMentorIds[i % createdMentorIds.length],
        });
      }
    } else if (mentorCount > 0) {
      const existing = await storage.getMentors();
      existing.forEach(m => createdMentorIds.push(m.id));
    }

    // ── 7. Events (50) ────────────────────────────────────────────────────────
    const eventCount = await getCount(events);
    const createdEventIds: number[] = [];

    if (eventCount === 0) {
      const eventTypes = ["satsang", "festival", "seva", "workshop", "retreat", "celebration", "youth", "kirtan"];
      const locations = [
        "Mumbai Central Sabha", "Delhi Satsang Bhawan", "Bangalore Ashram",
        "Pune Sabha Griha", "Hyderabad Center", "Chennai Seva Kendra",
        "Kolkata Satsang Hall", "Jaipur Ashram", "Haridwar Ashram", "Vrindavan Temple",
      ];
      const eventTitles = [
        "Shrimad Bhagwat Katha", "Janmashtami Celebration", "Ram Navami Festival",
        "Holi Celebration", "Diwali Puja", "Navratri Garba Night", "Guru Purnima Satsang",
        "Ekadashi Fasting Day", "Shravan Maas Seva", "Kartik Deepotsav",
        "Yoga & Meditation Retreat", "Bhagavad Gita Workshop", "Vedic Chanting Session",
        "Youth Leadership Summit", "Women's Seva Circle", "Senior Citizens Satsang",
        "Children's Spiritual Camp", "Annual Family Gathering", "Founder's Day",
        "New Year Puja", "Makar Sankranti Celebration", "Vasant Panchami Festival",
        "Maha Shivratri Night", "Chaitra Navratri", "Akshaya Tritiya Puja",
        "Hanuman Jayanti", "Buddha Purnima", "Ganesh Chaturthi", "Pitru Paksha Puja",
        "Sharad Navratri", "Kojagiri Purnima", "Tulsi Vivah", "Gita Jayanti",
        "Winter Solstice Satsang", "Makar Sankranti Kite Festival", "Spring Retreat",
        "Summer Youth Camp", "Monsoon Satsang", "Autumn Harvest Celebration",
        "Monthly Kirtan Night", "Bhajan Sandhya", "Vishnu Sahasranama Parayana",
        "Durga Saptashati Parayana", "Ramcharitmanas Path", "Sundarkand Parayana",
        "Seva Day at Old Age Home", "Blood Donation Camp", "Free Medical Camp",
        "Annadanam Seva", "Environment Awareness Walk",
      ];
      const statuses = ["completed", "completed", "completed", "active", "active", "planned", "planned", "planned"];

      const baseDate = new Date("2024-01-01");
      for (let i = 0; i < 50; i++) {
        const startDate = new Date(baseDate);
        startDate.setDate(startDate.getDate() + i * 7);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const isPast = startDate < new Date();

        const created = await storage.createEvent({
          title: eventTitles[i],
          description: `A sacred ${eventTypes[i % eventTypes.length]} event for the community. All devotees are welcome to participate and receive blessings.`,
          eventType: eventTypes[i % eventTypes.length],
          location: locations[i % locations.length],
          startDate: startDate,
          endDate: endDate,
          startTime: ["06:00", "08:00", "10:00", "16:00", "18:00", "19:00"][i % 6],
          endTime: ["08:00", "10:00", "12:00", "18:00", "20:00", "21:00"][i % 6],
          capacity: 50 + (i % 10) * 10,
          registrationRequired: i % 3 === 0,
          cost: i % 4 === 0 ? "0" : String(100 + (i % 5) * 50),
          status: isPast ? statuses[i % 4] : statuses[4 + (i % 4)],
          maxParticipants: 50 + (i % 10) * 10,
          createdBy: "admin",
          isActive: true,
          isArchived: false,
        });
        createdEventIds.push(created.id);
      }
    } else {
      const existing = await storage.getEvents();
      existing.forEach(e => createdEventIds.push(e.id));
    }

    // ── 8. Attendance (50) ────────────────────────────────────────────────────
    const attendanceCount = await getCount(attendance);
    if (attendanceCount === 0 && createdDevoteeIds.length > 0 && createdEventIds.length > 0) {
      const statuses = ["present", "present", "present", "absent", "late"];
      for (let i = 0; i < 50; i++) {
        const attDate = new Date("2024-06-01");
        attDate.setDate(attDate.getDate() + Math.floor(i * 3.5));
        await storage.createAttendance({
          devoteeId: createdDevoteeIds[i % createdDevoteeIds.length],
          eventId: createdEventIds[i % createdEventIds.length],
          attendanceDate: attDate,
          checkInTime: ["06:05", "08:10", "10:15", "16:20", "18:30"][i % 5],
          checkOutTime: ["08:00", "10:00", "12:00", "18:00", "20:00"][i % 5],
          status: statuses[i % statuses.length],
          notes: i % 5 === 3 ? "Was unwell" : undefined,
          recordedBy: "admin",
        });
      }
    }

    // ── 9. Donations (50) ─────────────────────────────────────────────────────
    const donationCount = await getCount(donations);
    if (donationCount === 0 && createdDevoteeIds.length > 0) {
      const donationTypes = ["general", "festival", "seva", "construction", "annadanam", "education"];
      const paymentMethods = ["cash", "upi", "bank_transfer", "cheque", "online"];
      const amounts = [501, 1001, 2100, 5001, 11000, 21000, 51000, 1100, 2501, 3001];
      const purposes = [
        "Monthly seva contribution", "Janmashtami festival fund", "Temple renovation",
        "Annadanam seva", "Education sponsorship", "Diwali celebration",
        "Guru Purnima donation", "Medical camp support", "Navratri festival",
        "Annual function contribution",
      ];

      for (let i = 0; i < 50; i++) {
        const donDate = new Date("2024-01-15");
        donDate.setDate(donDate.getDate() + i * 7);
        const txnId = `TXN${String(Date.now()).slice(-6)}${i}`;
        await storage.createDonation({
          devoteeId: createdDevoteeIds[i % createdDevoteeIds.length],
          amount: String(amounts[i % amounts.length]),
          currency: "INR",
          donationType: donationTypes[i % donationTypes.length],
          purpose: purposes[i % purposes.length],
          donationDate: donDate,
          paymentMethod: paymentMethods[i % paymentMethods.length],
          transactionId: txnId,
          receiptNumber: `RCP${String(i + 1).padStart(5, "0")}`,
          taxDeductible: i % 3 === 0,
          anonymousDonation: i % 10 === 0,
          notes: `Donation #${i + 1} recorded by admin`,
          recordedBy: "admin",
          status: "received",
        });
      }
    }

    // ── 10. Event Participation (50) ──────────────────────────────────────────
    const participationCount = await getCount(eventParticipation);
    if (participationCount === 0 && createdDevoteeIds.length > 0 && createdEventIds.length > 0) {
      const statuses = ["registered", "attended", "attended", "cancelled", "waitlisted"];
      for (let i = 0; i < 50; i++) {
        const regDate = new Date("2024-05-01");
        regDate.setDate(regDate.getDate() + i * 3);
        await db.insert(eventParticipation).values({
          eventId: createdEventIds[i % createdEventIds.length],
          devoteeId: createdDevoteeIds[(i + 5) % createdDevoteeIds.length],
          registrationDate: regDate,
          status: statuses[i % statuses.length],
          notes: i % 7 === 0 ? "VIP guest" : undefined,
        });
      }
    }

    // ── 11. Volunteering (50) ─────────────────────────────────────────────────
    const volunteeringCount = await getCount(volunteering);
    if (volunteeringCount === 0 && createdDevoteeIds.length > 0) {
      const activityTypes = ["kitchen_seva", "security", "decoration", "registration", "transport", "media", "cleanup", "teaching", "medical_support", "crowd_management"];
      const volStatuses = ["active", "completed", "completed", "paused"];
      const skills = ["Cooking", "Leadership", "Art & Craft", "Data Entry", "Driving", "Photography", "Cleaning", "Education", "First Aid", "Organization"];

      for (let i = 0; i < 50; i++) {
        const startDate = new Date("2024-02-01");
        startDate.setDate(startDate.getDate() + i * 6);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
        const isCompleted = endDate < new Date();

        await storage.createVolunteering({
          devoteeId: createdDevoteeIds[(i + 3) % createdDevoteeIds.length],
          activityType: activityTypes[i % activityTypes.length],
          description: `Volunteering for ${activityTypes[i % activityTypes.length].replace(/_/g, " ")} at community events.`,
          location: ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"][i % 5],
          startDate: startDate,
          endDate: endDate,
          hoursCommitted: 4 + (i % 6),
          hoursCompleted: isCompleted ? 4 + (i % 6) : Math.floor((4 + (i % 6)) * 0.6),
          skills: skills[i % skills.length],
          status: isCompleted ? "completed" : volStatuses[i % volStatuses.length],
          supervisorId: createdDevoteeIds[i % 10],
          feedback: isCompleted ? "Excellent contribution. Very dedicated." : undefined,
        });
      }
    }

    // ── 12. Group Memberships (50) ────────────────────────────────────────────
    const membershipCount = await getCount(groupMemberships);
    if (membershipCount === 0 && createdDevoteeIds.length > 0) {
      const allGroups = await storage.getGroups();
      const roles = ["member", "member", "member", "leader", "coordinator"];
      const memStatuses = ["active", "active", "active", "inactive"];

      for (let i = 0; i < 50; i++) {
        const joinDate = new Date("2023-01-01");
        joinDate.setMonth(joinDate.getMonth() + Math.floor(i / 4));
        const group = allGroups[i % allGroups.length];
        await db.insert(groupMemberships).values({
          groupId: group.id,
          devoteeId: createdDevoteeIds[i % createdDevoteeIds.length],
          role: roles[i % roles.length],
          joinDate: joinDate,
          status: memStatuses[i % memStatuses.length],
          notes: `Member of ${group.groupName}`,
        });
      }
    }

    // ── 13. Group Entries (50 additional entries) ─────────────────────────────
    const groupEntryCount = await getCount(groupEntries);
    if (groupEntryCount < 10) {
      const allGroups = await storage.getGroups();
      const familyGroup = allGroups.find(g => g.groupType === "family");
      const mentorGroup = allGroups.find(g => g.groupType === "mentor");
      const volunteerGroup = allGroups.find(g => g.groupType === "volunteer");
      const sabhaGroup = allGroups.find(g => g.groupType === "sabha");

      const entryDefs = [
        { group: familyGroup, count: 15, makeEntry: (i: number) => ({ groupId: familyGroup!.id, entryData: { familyName: `Demo Family ${i}`, headOfFamily: `Head ${i}`, totalMembers: 3 + (i % 4), fullAddress: `${i * 10} Demo Street`, mobileNumber: `98765${String(40000 + i).padStart(5, "0")}` }, uniqueMemberId: `FAM${String(100 + i).padStart(3, "0")}`, qrIdentifier: `JAISHRIMADHAV_FAM${String(100 + i).padStart(3, "0")}`, isActive: true }) },
        { group: mentorGroup, count: 10, makeEntry: (i: number) => ({ groupId: mentorGroup!.id, entryData: { firstName: `Mentor${i}`, surname: `Prabhu`, specialization: ["Gita", "Yoga", "Vedanta"][i % 3], experience: 5 + i, mobileNumber: `98765${String(50000 + i).padStart(5, "0")}`, maxMentees: 10 + i } , uniqueMemberId: `MEN${String(100 + i).padStart(3, "0")}`, qrIdentifier: `JAISHRIMADHAV_MEN${String(100 + i).padStart(3, "0")}`, isActive: true }) },
        { group: volunteerGroup, count: 15, makeEntry: (i: number) => ({ groupId: volunteerGroup!.id, entryData: { firstName: `Vol${i}`, surname: `Seva`, mobileNumber: `98765${String(60000 + i).padStart(5, "0")}`, volunteeringActivities: "Kitchen Seva, Decoration", availableHours: "Weekends", specialSkills: "Cooking" }, uniqueMemberId: `VOL${String(100 + i).padStart(3, "0")}`, qrIdentifier: `JAISHRIMADHAV_VOL${String(100 + i).padStart(3, "0")}`, isActive: true }) },
        { group: sabhaGroup, count: 10, makeEntry: (i: number) => ({ groupId: sabhaGroup!.id, entryData: { firstName: `Sabha${i}`, surname: `Das`, mobileNumber: `98765${String(70000 + i).padStart(5, "0")}`, dateOfJoining: `202${i % 5}-0${(i % 9) + 1}-01` }, uniqueMemberId: `SAB${String(100 + i).padStart(3, "0")}`, qrIdentifier: `JAISHRIMADHAV_SAB${String(100 + i).padStart(3, "0")}`, isActive: true }) },
      ];

      for (const { group, count: cnt, makeEntry } of entryDefs) {
        if (!group) continue;
        for (let i = 1; i <= cnt; i++) {
          try {
            await storage.createGroupEntry(makeEntry(i));
          } catch {
            // Skip if uniqueMemberId conflicts
          }
        }
      }
    }

    console.log("Demo data seeded successfully! (50 records per table)");
  } catch (error: any) {
    console.error("Error seeding demo data:", error?.message ?? error);
  }
}
