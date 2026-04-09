import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questions = [
    // ─── Full Stack Development (10 Questions) ────────────────
    {
        subject: 'fullstack',
        question: 'What does REST stand for in RESTful APIs?',
        option1: 'Representational State Transfer',
        option2: 'Remote Execution of Server Tasks',
        option3: 'Reliable and Efficient System Technology',
        option4: 'Resource Extraction and Storage Technique',
        correctAnswer: 1,
    },
    {
        subject: 'fullstack',
        question: 'Which HTTP method is idempotent and used to update a resource completely?',
        option1: 'POST',
        option2: 'PATCH',
        option3: 'PUT',
        option4: 'DELETE',
        correctAnswer: 3,
    },
    {
        subject: 'fullstack',
        question: 'In React, what hook is used to perform side effects in a functional component?',
        option1: 'useState',
        option2: 'useEffect',
        option3: 'useContext',
        option4: 'useReducer',
        correctAnswer: 2,
    },
    {
        subject: 'fullstack',
        question: 'What is the purpose of a JWT (JSON Web Token)?',
        option1: 'To style web pages',
        option2: 'To securely transmit information between parties as a JSON object',
        option3: 'To create database connections',
        option4: 'To compress images for the web',
        correctAnswer: 2,
    },
    {
        subject: 'fullstack',
        question: 'Which of the following is a NoSQL database?',
        option1: 'PostgreSQL',
        option2: 'MySQL',
        option3: 'MongoDB',
        option4: 'SQLite',
        correctAnswer: 3,
    },
    {
        subject: 'fullstack',
        question: 'What does SSR stand for in Next.js?',
        option1: 'Server-Side Rendering',
        option2: 'Static Site Replication',
        option3: 'Single Source Repository',
        option4: 'Secure Socket Relay',
        correctAnswer: 1,
    },
    {
        subject: 'fullstack',
        question: 'Which tool is used for containerizing applications?',
        option1: 'Kubernetes',
        option2: 'Docker',
        option3: 'Jenkins',
        option4: 'Terraform',
        correctAnswer: 2,
    },
    {
        subject: 'fullstack',
        question: 'What is the Virtual DOM in React?',
        option1: 'A copy of the real DOM kept in memory for efficient updates',
        option2: 'A physical server that hosts DOM elements',
        option3: 'A database for storing DOM structures',
        option4: 'A CSS framework for DOM manipulation',
        correctAnswer: 1,
    },
    {
        subject: 'fullstack',
        question: 'Which status code indicates a successful resource creation?',
        option1: '200',
        option2: '201',
        option3: '204',
        option4: '301',
        correctAnswer: 2,
    },
    {
        subject: 'fullstack',
        question: 'What is middleware in Express.js?',
        option1: 'A database connector',
        option2: 'A function that has access to request, response, and next function',
        option3: 'A CSS preprocessor',
        option4: 'A template engine',
        correctAnswer: 2,
    },

    // ─── DBMS (10 Questions) ──────────────────────────────────
    {
        subject: 'dbms',
        question: 'What does ACID stand for in database transactions?',
        option1: 'Atomicity, Consistency, Isolation, Durability',
        option2: 'Association, Concurrency, Integrity, Data',
        option3: 'Automatic, Controlled, Indexed, Distributed',
        option4: 'Authentication, Caching, Integration, Deployment',
        correctAnswer: 1,
    },
    {
        subject: 'dbms',
        question: 'Which normal form eliminates transitive dependencies?',
        option1: '1NF',
        option2: '2NF',
        option3: '3NF',
        option4: 'BCNF',
        correctAnswer: 3,
    },
    {
        subject: 'dbms',
        question: 'What type of JOIN returns all rows from the left table and matched rows from the right?',
        option1: 'INNER JOIN',
        option2: 'LEFT JOIN',
        option3: 'RIGHT JOIN',
        option4: 'CROSS JOIN',
        correctAnswer: 2,
    },
    {
        subject: 'dbms',
        question: 'Which SQL command is used to remove a table from the database?',
        option1: 'DELETE TABLE',
        option2: 'REMOVE TABLE',
        option3: 'DROP TABLE',
        option4: 'TRUNCATE TABLE',
        correctAnswer: 3,
    },
    {
        subject: 'dbms',
        question: 'What is a foreign key?',
        option1: 'A key that uniquely identifies each record in a table',
        option2: 'A key used to encrypt data',
        option3: 'A field that links to the primary key of another table',
        option4: 'A composite key made of multiple columns',
        correctAnswer: 3,
    },
    {
        subject: 'dbms',
        question: 'What is the purpose of an index in a database?',
        option1: 'To encrypt sensitive data',
        option2: 'To speed up data retrieval operations',
        option3: 'To create backup copies',
        option4: 'To enforce referential integrity',
        correctAnswer: 2,
    },
    {
        subject: 'dbms',
        question: 'Which isolation level prevents dirty reads but allows non-repeatable reads?',
        option1: 'READ UNCOMMITTED',
        option2: 'READ COMMITTED',
        option3: 'REPEATABLE READ',
        option4: 'SERIALIZABLE',
        correctAnswer: 2,
    },
    {
        subject: 'dbms',
        question: 'What is a deadlock in DBMS?',
        option1: 'When a query takes too long to execute',
        option2: 'When two or more transactions wait indefinitely for each other to release locks',
        option3: 'When the database runs out of storage',
        option4: 'When a table has too many indexes',
        correctAnswer: 2,
    },
    {
        subject: 'dbms',
        question: 'Which of the following is a DDL command?',
        option1: 'SELECT',
        option2: 'INSERT',
        option3: 'ALTER',
        option4: 'UPDATE',
        correctAnswer: 3,
    },
    {
        subject: 'dbms',
        question: 'What does a VIEW in SQL represent?',
        option1: 'A physical copy of a table',
        option2: 'A virtual table based on the result of a SELECT query',
        option3: 'A stored procedure',
        option4: 'A trigger mechanism',
        correctAnswer: 2,
    },

    // ─── Operating Systems (10 Questions) ─────────────────────
    {
        subject: 'os',
        question: 'What scheduling algorithm gives the minimum average waiting time?',
        option1: 'FCFS (First Come First Served)',
        option2: 'SJF (Shortest Job First)',
        option3: 'Round Robin',
        option4: 'Priority Scheduling',
        correctAnswer: 2,
    },
    {
        subject: 'os',
        question: 'What is a semaphore used for?',
        option1: 'Memory allocation',
        option2: 'Process synchronization',
        option3: 'File management',
        option4: 'Network communication',
        correctAnswer: 2,
    },
    {
        subject: 'os',
        question: 'Which page replacement algorithm suffers from Belady\'s Anomaly?',
        option1: 'LRU',
        option2: 'Optimal',
        option3: 'FIFO',
        option4: 'LFU',
        correctAnswer: 3,
    },
    {
        subject: 'os',
        question: 'What is thrashing in an operating system?',
        option1: 'When CPU utilization is very high',
        option2: 'When the system spends more time swapping pages than executing processes',
        option3: 'When too many processes are in ready queue',
        option4: 'When disk space runs out',
        correctAnswer: 2,
    },
    {
        subject: 'os',
        question: 'Which of the following is NOT a necessary condition for deadlock?',
        option1: 'Mutual Exclusion',
        option2: 'Hold and Wait',
        option3: 'Preemption',
        option4: 'Circular Wait',
        correctAnswer: 3,
    },
    {
        subject: 'os',
        question: 'What is the role of the kernel in an operating system?',
        option1: 'To manage user interface',
        option2: 'To manage hardware resources and provide services to applications',
        option3: 'To compile source code',
        option4: 'To manage internet connectivity',
        correctAnswer: 2,
    },
    {
        subject: 'os',
        question: 'What is virtual memory?',
        option1: 'RAM installed on the GPU',
        option2: 'A technique that uses disk space to extend physical memory',
        option3: 'Cloud-based memory storage',
        option4: 'Cache memory in the CPU',
        correctAnswer: 2,
    },
    {
        subject: 'os',
        question: 'Which system call is used to create a new process in Unix?',
        option1: 'exec()',
        option2: 'fork()',
        option3: 'spawn()',
        option4: 'create()',
        correctAnswer: 2,
    },
    {
        subject: 'os',
        question: 'What is the difference between a process and a thread?',
        option1: 'They are the same thing',
        option2: 'A thread is a lightweight process that shares memory space with other threads',
        option3: 'A process runs faster than a thread',
        option4: 'Threads cannot communicate with each other',
        correctAnswer: 2,
    },
    {
        subject: 'os',
        question: 'Which disk scheduling algorithm provides the least seek time on average?',
        option1: 'FCFS',
        option2: 'SSTF (Shortest Seek Time First)',
        option3: 'SCAN',
        option4: 'LOOK',
        correctAnswer: 2,
    },
];

async function main() {
    console.log('🌱 Seeding quiz questions...');

    // Clear existing questions
    await prisma.question.deleteMany();

    // Insert all questions
    for (const question of questions) {
        await prisma.question.create({
            data: question,
        });
    }

    console.log(`✅ Seeded ${questions.length} questions successfully!`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
