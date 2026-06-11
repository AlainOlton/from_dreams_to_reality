/// <reference types="node" />
import "dotenv/config";
import "tsconfig-paths/register";
import { PrismaClient, Role, InternshipType, InternshipStatus, ApplicationStatus, LogbookFrequency, EvaluationStage, EvaluationStatus, NotificationType, AttendanceStatus, MessageStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const HASH = await bcrypt.hash("Password1", 10);

  // ──────────────────────────────────────────────
  // USERS (upsert — idempotent)
  // ──────────────────────────────────────────────

  // ADMIN
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@ims.dev" },
    update: { password: HASH },
    create: {
      email: "admin@ims.dev",
      password: HASH,
      role: Role.ADMIN,
      isEmailVerified: true,
      adminProfile: {
        create: {
          firstName: "System",
          lastName: "Admin",
        },
      },
    },
    include: { adminProfile: true },
  });

  // STUDENT
  const studentUser = await prisma.user.upsert({
    where: { email: "" },
    update: { password: HASH },
    create: {
      email: "student@ims.dev",
      password: HASH,
      role: Role.STUDENT,
      isEmailVerified: true,
      studentProfile: {
        create: {
          firstName: "Alice",
          lastName: "Mugisha",
          studentId: "STU-001",
          department: "Computer Science",
          institution: "University of Rwanda",
        },
      },
    },
    include: { studentProfile: true },
  });

  // ACADEMIC Sstudent@ims.devUPERVISOR
  const academicUser = await prisma.user.upsert({
    where: { email: "academic@ims.dev" },
    update: { password: HASH },
    create: {
      email: "academic@ims.dev",
      password: HASH,
      role: Role.ACADEMIC_SUPERVISOR,
      isEmailVerified: true,
      supervisorProfile: {
        create: {
          firstName: "Dr. Jean",
          lastName: "Habimana",
          title: "Professor",
        },
      },
    },
    include: { supervisorProfile: true },
  });

  // SITE SUPERVISOR
  const siteUser = await prisma.user.upsert({
    where: { email: "site@ims.dev" },
    update: { password: HASH },
    create: {
      email: "site@ims.dev",
      password: HASH,
      role: Role.SITE_SUPERVISOR,
      isEmailVerified: true,
      supervisorProfile: {
        create: {
          firstName: "Placidie",
          lastName: "Mwizerwa",
        },
      },
    },
    include: { supervisorProfile: true },
  });

  // UNIVERSITY
  const universityUser = await prisma.user.upsert({
    where: { email: 'university@ims.dev' },
    update: { password: HASH },
    create: {
      email: 'university@ims.dev',
      password: HASH,
      // @ts-ignore — Role enum updated after prisma generate; IDE cache may be stale
      role: Role.UNIVERSITY,
      isEmailVerified: true,
      // @ts-ignore
      universityProfile: {
        create: {
          universityName:    'University of Rwanda',
          country:           'Rwanda',
          city:              'Kigali',
          website:           'https://ur.ac.rw',
          phone:             '+250788000001',
          email:             'internships@ur.ac.rw',
          contactPersonName: 'Dr. Marie Uwimana',
          isVerified:        true,
        },
      },
    },
    // @ts-ignore
    include: { universityProfile: true },
  })

  // UNIVERSITY
  // @ts-ignore — Role enum updated after prisma generate; IDE cache may be stale
  void universityUser

  // COMPANY 1
  const company1User = await prisma.user.upsert({
    where: { email: "company1@ims.dev" },
    update: { password: HASH },
    create: {
      email: "company1@ims.dev",
      password: HASH,
      role: Role.COMPANY,
      isEmailVerified: true,
      companyProfile: {
        create: {
          companyName: "Rwanda Tech Hub",
          city: "Kigali",
          country: "Rwanda",
          isVerified: true,
        },
      },
    },
    include: { companyProfile: true },
  });

  // COMPANY 2
  const company2User = await prisma.user.upsert({
    where: { email: "company2@ims.dev" },
    update: { password: HASH },
    create: {
      email: "company2@ims.dev",
      password: HASH,
      role: Role.COMPANY,
      isEmailVerified: true,
      companyProfile: {
        create: {
          companyName: "Digital Africa Ltd",
          city: "Nairobi",
          country: "Kenya",
          isVerified: true,
        },
      },
    },
    include: { companyProfile: true },
  });

  const studentProfile = studentUser.studentProfile!;

  // STUDENT 2 — also from University of Rwanda so university dashboard has data
  const student2User = await prisma.user.upsert({
    where: { email: 'student2@ims.dev' },
    update: { password: HASH },
    create: {
      email: 'student2@ims.dev',
      password: HASH,
      role: Role.STUDENT,
      isEmailVerified: true,
      studentProfile: {
        create: {
          firstName:   'Bob',
          lastName:    'Nkurunziza',
          studentId:   'STU-002',
          department:  'Information Technology',
          faculty:     'Science & Technology',
          yearOfStudy: 3,
          institution: 'University of Rwanda',
          skills:      ['Python', 'Django', 'SQL'],
        },
      },
    },
    include: { studentProfile: true },
  });
  void student2User // suppress unused warning
  const academicProfile = academicUser.supervisorProfile!;
  const siteProfile = siteUser.supervisorProfile!;
  const company1Profile = company1User.companyProfile!;
  const company2Profile = company2User.companyProfile!;

  // ──────────────────────────────────────────────
  // INTERNSHIP LISTINGS (6 total)
  // ──────────────────────────────────────────────

  const internship1 = await prisma.internship.create({
    data: {
      companyId: company1Profile.id,
      title: "Software Engineering Intern",
      description: "Work on real-world web applications using modern JavaScript frameworks.",
      type: InternshipType.PROFESSIONAL,
      status: InternshipStatus.OPEN,
      field: "Software Engineering",
      city: "Kigali",
      country: "Rwanda",
      isRemote: false,
      isPaid: true,
      stipendAmount: 150,
      currency: "USD",
      durationWeeks: 12,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-09-30"),
      applicationDeadline: new Date("2025-06-15"),
      slots: 3,
      requirements: ["JavaScript", "React", "Node.js"],
      responsibilities: ["Build UI components", "Write unit tests", "Participate in code reviews"],
      skills: ["React", "TypeScript", "REST APIs"],
    },
  });

  const internship2 = await prisma.internship.create({
    data: {
      companyId: company1Profile.id,
      title: "Data Science Intern",
      description: "Analyse large datasets and build predictive models for business insights.",
      type: InternshipType.PROFESSIONAL,
      status: InternshipStatus.OPEN,
      field: "Data Science",
      city: "Kigali",
      country: "Rwanda",
      isRemote: true,
      isPaid: true,
      stipendAmount: 200,
      currency: "USD",
      durationWeeks: 16,
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-11-30"),
      applicationDeadline: new Date("2025-07-20"),
      slots: 2,
      requirements: ["Python", "Machine Learning basics"],
      responsibilities: ["Data cleaning", "Model training", "Report generation"],
      skills: ["Python", "Pandas", "Scikit-learn"],
    },
  });

  const internship3 = await prisma.internship.create({
    data: {
      companyId: company2Profile.id,
      title: "Backend Developer Intern",
      description: "Develop and maintain RESTful APIs for our fintech platform.",
      type: InternshipType.PROFESSIONAL,
      status: InternshipStatus.OPEN,
      field: "Backend Development",
      city: "Nairobi",
      country: "Kenya",
      isRemote: false,
      isPaid: true,
      stipendAmount: 180,
      currency: "USD",
      durationWeeks: 12,
      startDate: new Date("2025-07-15"),
      endDate: new Date("2025-10-15"),
      applicationDeadline: new Date("2025-06-30"),
      slots: 2,
      requirements: ["Node.js", "PostgreSQL", "REST APIs"],
      responsibilities: ["API development", "Database design", "Documentation"],
      skills: ["Node.js", "Express", "PostgreSQL"],
    },
  });

  const internship4 = await prisma.internship.create({
    data: {
      companyId: company2Profile.id,
      title: "UI/UX Design Intern",
      description: "Design intuitive user interfaces and conduct usability testing.",
      type: InternshipType.PROFESSIONAL,
      status: InternshipStatus.DRAFT,
      field: "Design",
      city: "Nairobi",
      country: "Kenya",
      isRemote: true,
      isPaid: false,
      durationWeeks: 8,
      slots: 1,
      requirements: ["Figma", "Adobe XD"],
      responsibilities: ["Wireframing", "Prototyping", "User research"],
      skills: ["Figma", "UI Design", "User Research"],
    },
  });

  const internship5 = await prisma.internship.create({
    data: {
      companyId: company1Profile.id,
      title: "Academic Research Intern — AI",
      description: "Assist faculty in AI research projects and literature reviews.",
      type: InternshipType.ACADEMIC,
      status: InternshipStatus.OPEN,
      field: "Artificial Intelligence",
      city: "Kigali",
      country: "Rwanda",
      isRemote: false,
      isPaid: false,
      durationWeeks: 10,
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-11-15"),
      applicationDeadline: new Date("2025-08-20"),
      slots: 4,
      requirements: ["Python", "Research skills"],
      responsibilities: ["Literature review", "Experiment design", "Report writing"],
      skills: ["Python", "Research", "Academic Writing"],
    },
  });

  const internship6 = await prisma.internship.create({
    data: {
      companyId: company2Profile.id,
      title: "Cybersecurity Intern",
      description: "Support the security team with vulnerability assessments and monitoring.",
      type: InternshipType.ACADEMIC,
      status: InternshipStatus.DRAFT,
      field: "Cybersecurity",
      city: "Nairobi",
      country: "Kenya",
      isRemote: false,
      isPaid: true,
      stipendAmount: 120,
      currency: "USD",
      durationWeeks: 12,
      slots: 2,
      requirements: ["Networking basics", "Linux"],
      responsibilities: ["Vulnerability scanning", "Log analysis", "Security reporting"],
      skills: ["Linux", "Networking", "Security Tools"],
    },
  });

  void internship4; void internship6 // DRAFT listings — created but not used in relations

  // ──────────────────────────────────────────────
  // APPLICATIONS
  // ──────────────────────────────────────────────

  const application1 = await prisma.application.create({
    data: {
      internshipId: internship1.id,
      studentId: studentProfile.id,
      status: ApplicationStatus.ACCEPTED,
      coverLetterText: "I am excited to apply for the Software Engineering Intern position at Rwanda Tech Hub.",
      appliedAt: new Date("2025-05-10"),
      reviewedAt: new Date("2025-05-15"),
    },
  });
  void application1 // accepted application — used for context, no further relations needed

  await prisma.application.create({
    data: {
      internshipId: internship2.id,
      studentId: studentProfile.id,
      status: ApplicationStatus.REVIEWED,
      coverLetterText: "My background in data analysis makes me a strong candidate for this role.",
      appliedAt: new Date("2025-05-12"),
      reviewedAt: new Date("2025-05-18"),
    },
  });

  await prisma.application.create({
    data: {
      internshipId: internship3.id,
      studentId: studentProfile.id,
      status: ApplicationStatus.APPLIED,
      coverLetterText: "I would love to contribute to Digital Africa Ltd's backend team.",
      appliedAt: new Date("2025-05-20"),
    },
  });

  // ──────────────────────────────────────────────
  // INTERNSHIP ENROLLMENT
  // ──────────────────────────────────────────────

  const enrollment = await prisma.internshipEnrollment.create({
    data: {
      studentId: studentProfile.id,
      internshipId: internship1.id,
      type: InternshipType.PROFESSIONAL,
      companyName: "Rwanda Tech Hub",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-09-30"),
      isActive: true,
    },
  });

  // ──────────────────────────────────────────────
  // SUPERVISOR ASSIGNMENT
  // ──────────────────────────────────────────────

  await prisma.supervisorAssignment.create({
    data: {
      enrollmentId: enrollment.id,
      academicSupervisorId: academicProfile.id,
      siteSupervisorId: siteProfile.id,
    },
  });

  // ──────────────────────────────────────────────
  // LOGBOOK ENTRIES (3 entries — mix of approved/pending)
  // ──────────────────────────────────────────────

  await prisma.logbookEntry.create({
    data: {
      studentId: studentProfile.id,
      enrollmentId: enrollment.id,
      frequency: LogbookFrequency.WEEKLY,
      entryDate: new Date("2025-07-07"),
      weekNumber: 1,
      activitiesDone: "Onboarding, environment setup, codebase walkthrough with the team.",
      skillsGained: "Git workflow, project architecture understanding.",
      challenges: "Setting up the local dev environment took longer than expected.",
      nextWeekPlan: "Start working on the assigned UI components.",
      isApproved: true,
      approvedAt: new Date("2025-07-09"),
      approvedById: academicUser.id,
    },
  });

  await prisma.logbookEntry.create({
    data: {
      studentId: studentProfile.id,
      enrollmentId: enrollment.id,
      frequency: LogbookFrequency.WEEKLY,
      entryDate: new Date("2025-07-14"),
      weekNumber: 2,
      activitiesDone: "Built the user profile page component and integrated it with the REST API.",
      skillsGained: "React hooks, Axios integration, TypeScript generics.",
      challenges: "Handling async state updates and loading states correctly.",
      nextWeekPlan: "Implement the notifications panel and write unit tests.",
      isApproved: true,
      approvedAt: new Date("2025-07-16"),
      approvedById: academicUser.id,
    },
  });

  await prisma.logbookEntry.create({
    data: {
      studentId: studentProfile.id,
      enrollmentId: enrollment.id,
      frequency: LogbookFrequency.WEEKLY,
      entryDate: new Date("2025-07-21"),
      weekNumber: 3,
      activitiesDone: "Implemented notifications panel, wrote 15 unit tests, participated in sprint review.",
      skillsGained: "Jest testing, Agile ceremonies, code review practices.",
      challenges: "Mocking external API calls in tests was tricky.",
      nextWeekPlan: "Work on the dashboard analytics charts.",
      isApproved: false,
    },
  });

  // ──────────────────────────────────────────────
  // ATTENDANCE RECORDS (2 records)
  // ──────────────────────────────────────────────

  await prisma.attendanceRecord.upsert({
    where: { studentId_date: { studentId: studentProfile.id, date: new Date("2025-07-07") } },
    update: {},
    create: {
      studentId: studentProfile.id,
      enrollmentId: enrollment.id,
      date: new Date("2025-07-07"),
      status: AttendanceStatus.PRESENT,
      checkInTime: new Date("2025-07-07T08:00:00Z"),
      checkOutTime: new Date("2025-07-07T17:00:00Z"),
      hoursLogged: 9,
    },
  });

  await prisma.attendanceRecord.upsert({
    where: { studentId_date: { studentId: studentProfile.id, date: new Date("2025-07-08") } },
    update: {},
    create: {
      studentId: studentProfile.id,
      enrollmentId: enrollment.id,
      date: new Date("2025-07-08"),
      status: AttendanceStatus.LATE,
      checkInTime: new Date("2025-07-08T09:30:00Z"),
      checkOutTime: new Date("2025-07-08T17:00:00Z"),
      hoursLogged: 7.5,
      note: "Traffic delay",
    },
  });

  // ──────────────────────────────────────────────
  // MIDTERM EVALUATION (from academic supervisor)
  // ──────────────────────────────────────────────

  await prisma.evaluation.create({
    data: {
      enrollmentId: enrollment.id,
      evaluatorId: academicProfile.id,
      stage: EvaluationStage.MIDTERM,
      status: EvaluationStatus.SUBMITTED,
      punctuality: 4,
      communication: 5,
      technicalSkills: 4,
      teamwork: 5,
      initiative: 4,
      professionalism: 5,
      overallScore: 4.5,
      strengths: "Alice demonstrates excellent communication skills and a strong work ethic.",
      areasForImprovement: "Could improve on time management during complex tasks.",
      generalComments: "Overall a very promising intern. Highly engaged and proactive.",
      recommendForHire: true,
      submittedAt: new Date("2025-08-05"),
    },
  });

  // ──────────────────────────────────────────────
  // SELF-ASSESSMENT (from student)
  // ──────────────────────────────────────────────

  await prisma.selfAssessment.create({
    data: {
      studentId: studentProfile.id,
      enrollmentId: enrollment.id,
      stage: EvaluationStage.MIDTERM,
      skillsDeveloped: 4,
      goalsMet: 4,
      supervisorSupport: 5,
      workEnvironment: 5,
      overallExperience: 4,
      achievements: "Successfully delivered the user profile and notifications features on schedule.",
      challenges: "Adapting to the team's fast-paced sprint cycles was initially challenging.",
      lessonsLearned: "Effective communication and asking for help early saves a lot of time.",
      futureGoals: "Deepen my knowledge of system design and cloud infrastructure.",
      submittedAt: new Date("2025-08-06"),
    },
  });

  // ──────────────────────────────────────────────
  // CONVERSATION + MESSAGES (student ↔ academic supervisor)
  // ──────────────────────────────────────────────

  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: studentUser.id },
          { userId: academicUser.id },
        ],
      },
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: academicUser.id,
      receiverId: studentUser.id,
      content: "Hi Alice, just checking in — how is the internship going so far? Please make sure your Week 3 logbook is submitted by Friday.",
      status: MessageStatus.READ,
      sentAt: new Date("2025-07-22T10:00:00Z"),
      deliveredAt: new Date("2025-07-22T10:00:05Z"),
      readAt: new Date("2025-07-22T10:15:00Z"),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: studentUser.id,
      receiverId: academicUser.id,
      content: "Hello Dr. Habimana! Everything is going really well. I have already submitted the Week 3 logbook. Looking forward to your feedback.",
      status: MessageStatus.DELIVERED,
      sentAt: new Date("2025-07-22T10:20:00Z"),
      deliveredAt: new Date("2025-07-22T10:20:05Z"),
    },
  });

  // ──────────────────────────────────────────────
  // NOTIFICATIONS (2 for student)
  // ──────────────────────────────────────────────

  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: NotificationType.APPLICATION_UPDATE,
      title: "Application Accepted",
      body: "Congratulations! Your application for Software Engineering Intern at Rwanda Tech Hub has been accepted.",
      isRead: true,
      link: "/student/applications",
      readAt: new Date("2025-05-16T09:00:00Z"),
      createdAt: new Date("2025-05-15T14:00:00Z"),
    },
  });

  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: NotificationType.EVALUATION_DUE,
      title: "Midterm Evaluation Available",
      body: "Your midterm self-assessment is now available. Please complete it before the deadline.",
      isRead: false,
      link: "/student/evaluations",
      createdAt: new Date("2025-08-01T08:00:00Z"),
    },
  });

  // ──────────────────────────────────────────────
  // BOOKMARK (student bookmarks internship 5)
  // ──────────────────────────────────────────────

  await prisma.bookmark.create({
    data: {
      userId: studentUser.id,
      internshipId: internship5.id,
    },
  });

  console.log("✓ Seed complete");
}

main()
  .catch((err) => {
    console.error("✗ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
