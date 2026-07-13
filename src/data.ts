import { Course, SkillAssessment, EmployeeProgress } from './types';

export const COURSES: Course[] = [
  {
    id: 'course-aws-arch',
    title: 'Advanced Enterprise Architecture with Microservices',
    category: 'Software Architecture',
    level: 'Advanced',
    duration: '24 hours',
    lessonsCount: 12,
    rating: 4.8,
    reviewsCount: 345,
    instructor: 'Marc van Holst',
    instructorTitle: 'Principal Consultant & CTO at Xebia',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    description: 'Master microservices, distributed transaction saga patterns, CQRS, and service-mesh structures to architect robust, resilient, and highly available enterprise-level software systems.',
    skillsAcquired: ['Saga Patterns', 'CQRS Architecture', 'Event Sourcing', 'API Gateways', 'Distributed Consensus'],
    syllabus: [
      {
        title: 'Module 1: AWS Design Principles & VPC',
        duration: '8 hours',
        lessons: [
          { id: 'aws-l1', title: 'Welcome to Xebia AWS Mastery', duration: '12 min', type: 'video', content: 'Introduction to AWS Solutions Architect roadmap and learning methodology by Alex.' },
          { id: 'aws-l2', title: 'Designing High-Performance VPCs', duration: '45 min', type: 'video', content: 'Hands-on VPC construction: public/private subnets, NAT Gateways, Route Tables, and internet access.' },
          { id: 'aws-l3', title: 'Subnets, Routes & Security Groups', duration: '30 min', type: 'reading', content: 'In-depth reading on VPC isolation, stateless Network ACLs vs stateful Security Groups.' },
          { id: 'aws-l4', title: 'VPC Design Knowledge Check', duration: '15 min', type: 'quiz' }
        ]
      },
      {
        title: 'Module 2: Compute, Storage & Databases',
        duration: '10 hours',
        lessons: [
          { id: 'aws-l5', title: 'EC2 Instances & Elastic Load Balancing', duration: '50 min', type: 'video', content: 'Scaling computing capacity horizontally. Deploying ALBs and NLBs for auto-scaled environments.' },
          { id: 'aws-l6', title: 'AWS Storage deep dive: S3, EBS, and EFS', duration: '40 min', type: 'video', content: 'Understanding file, block, and object storage performance metrics and lifecycle rules.' },
          { id: 'aws-l7', title: 'Choosing the Right Database: RDS vs DynamoDB', duration: '35 min', type: 'reading', content: 'Comprehensive guide comparing Aurora relational database workloads with DynamoDB serverless NoSQL engines.' },
          { id: 'aws-l8', title: 'Core Services Quiz', duration: '15 min', type: 'quiz' }
        ]
      },
      {
        title: 'Module 3: Serverless & Security Management',
        duration: '6 hours',
        lessons: [
          { id: 'aws-l9', title: 'Building Serverless Workloads with Lambda', duration: '45 min', type: 'video', content: 'Creating event-driven architectures with AWS Lambda, API Gateway, and S3 events.' },
          { id: 'aws-l10', title: 'AWS IAM Policy Structure & Security Best Practices', duration: '30 min', type: 'video', content: 'Deep dive into IAM roles, cross-account access, and credential boundary controls.' },
          { id: 'aws-l11', title: 'CloudFormation & Infrastructure as Code', duration: '30 min', type: 'reading', content: 'Deploying entire stacks safely via template scripts. Declaring parameters and resource dependencies.' },
          { id: 'aws-l12', title: 'Final Architectural Challenge', duration: '20 min', type: 'quiz' }
        ]
      }
    ]
  },
  {
    id: 'course-k8s-prod',
    title: 'Kubernetes Production Orchestration (CKA)',
    category: 'DevOps',
    level: 'Advanced',
    duration: '32 hours',
    lessonsCount: 10,
    rating: 4.9,
    reviewsCount: 512,
    instructor: 'Lucia Russo',
    instructorTitle: 'Cloud Native Practice Lead at Xebia',
    coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600&auto=format&fit=crop',
    description: 'Architect, configure, and maintain production-ready Kubernetes clusters. Prepare thoroughly for the Certified Kubernetes Administrator (CKA) exam with hands-on labs.',
    skillsAcquired: ['Cluster Architecture', 'Pod Scheduling', 'Ingress Controller', 'Troubleshooting', 'Helm Packaging'],
    syllabus: [
      {
        title: 'Module 1: Kubernetes Core Concepts & Cluster Setups',
        duration: '10 hours',
        lessons: [
          { id: 'k8s-l1', title: 'Architecture of the Kubernetes Control Plane', duration: '30 min', type: 'video', content: 'Exploring API Server, etcd, Scheduler, Controller Manager, and Kubelet operations.' },
          { id: 'k8s-l2', title: 'Deploying Clusters with Kubeadm', duration: '60 min', type: 'video', content: 'Step-by-step master and node bootstrap process. Setting up container runtimes (containerd).' },
          { id: 'k8s-l3', title: 'Core Pod Lifecycle and Scheduling Controls', duration: '40 min', type: 'reading', content: 'How Pod states change. Setting resource limits, taints, tolerations, and node affinity rules.' },
          { id: 'k8s-l4', title: 'Cluster Administration Quiz', duration: '15 min', type: 'quiz' }
        ]
      },
      {
        title: 'Module 2: Networking, Services & Storage',
        duration: '12 hours',
        lessons: [
          { id: 'k8s-l5', title: 'Kubernetes Networking Model & CNI Plugins', duration: '45 min', type: 'video', content: 'How Pods communicate across hosts. Configuring Calico and Flannel networks.' },
          { id: 'k8s-l6', title: 'Exposing Pods: ClusterIP, NodePort, and LoadBalancer', duration: '50 min', type: 'video', content: 'Configuring Services and Ingress Controllers (NGINX) for external path routing and TLS termination.' },
          { id: 'k8s-l7', title: 'Persistent Volumes and Storage Classes', duration: '35 min', type: 'reading', content: 'Connecting containers to durable state. Dynamic provisioning of PVs via PVCs and storage drivers.' }
        ]
      },
      {
        title: 'Module 3: Diagnostics, Security & Troubleshooting',
        duration: '10 hours',
        lessons: [
          { id: 'k8s-l8', title: 'Debugging Faulty Pods and Nodes', duration: '45 min', type: 'video', content: 'Troubleshooting crashloopbackoff, imagepullerror, pending states, and kubelet node pressure.' },
          { id: 'k8s-l9', title: 'Cluster Security and RBAC Policies', duration: '40 min', type: 'video', content: 'Creating Roles, ClusterRoles, and ServiceAccounts to restrict namespace administrative operations.' },
          { id: 'k8s-l10', title: 'CKA Live Simulation Exam', duration: '30 min', type: 'quiz' }
        ]
      }
    ]
  },
  {
    id: 'course-genai-prompt',
    title: 'Generative AI for Devs',
    category: 'Data & AI',
    level: 'Beginner Friendly',
    duration: '4 Modules',
    lessonsCount: 8,
    rating: 4.7,
    reviewsCount: 289,
    instructor: 'Dr. Vivek Sharma',
    instructorTitle: 'AI Research Director at Xebia',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop',
    description: 'Harness the power of LLMs, agentic chains, function-calling, and custom prompt loops to accelerate your enterprise development cycle and eliminate developer bottlenecks.',
    skillsAcquired: ['Chain-of-Thought', 'Few-Shot Learning', 'Retrieval-Augmented Gen', 'Agentic Workflows', 'LLM Guardrails'],
    syllabus: [
      {
        title: 'Module 1: Foundations of Generative AI & Prompting',
        duration: '6 hours',
        lessons: [
          { id: 'ai-l1', title: 'Introduction to Large Language Models (LLMs)', duration: '20 min', type: 'video', content: 'Understand neural network transformers, parameters, tokenization, and temperature settings.' },
          { id: 'ai-l2', title: 'The Anatomy of a Perfect Prompt', duration: '35 min', type: 'video', content: 'Constructing prompts using clear instructions, context, input data, and strict format outputs.' },
          { id: 'ai-l3', title: 'Zero-Shot vs. Few-Shot Learning Tactics', duration: '30 min', type: 'reading', content: 'Guiding the model behavior through structural examples in your system instructions.' },
          { id: 'ai-l4', title: 'Foundational Prompting Quiz', duration: '15 min', type: 'quiz' }
        ]
      },
      {
        title: 'Module 2: Advanced AI Architectures',
        duration: '8 hours',
        lessons: [
          { id: 'ai-l5', title: 'Chain-of-Thought (CoT) Reasoning', duration: '45 min', type: 'video', content: 'Eliciting logical reasoning sequences from LLMs for complex calculations and system designs.' },
          { id: 'ai-l6', title: 'RAG: Bringing External Data to your LLM', duration: '55 min', type: 'video', content: 'Connecting prompts to vector databases (Pinecone/Chroma) to eliminate hallucinations with fresh facts.' },
          { id: 'ai-l7', title: 'AI Agentic Workflows & Tool Calling', duration: '40 min', type: 'reading', content: 'Enabling models to execute functions, call APIs, and reason in iterative feedback loops.' },
          { id: 'ai-l8', title: 'Advanced Agent Design Quiz', duration: '20 min', type: 'quiz' }
        ]
      }
    ]
  },
  {
    id: 'course-scrum-master',
    title: 'Professional Scrum Master I (PSM I) Training',
    category: 'Agile & Scrum',
    level: 'Beginner',
    duration: '16 hours',
    lessonsCount: 8,
    rating: 4.85,
    reviewsCount: 422,
    instructor: 'Marieke de Groot',
    instructorTitle: 'Agile Coach & Partner at Xebia Academy',
    coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop',
    description: 'Learn the Scrum Framework in detail. Gain the tools, leadership principles, and facilitation strategies required to pass the PSM I certification and lead high-performing teams.',
    skillsAcquired: ['Scrum Framework', 'Sprint Planning', 'Facilitation & Coaching', 'Burndown Metrics', 'Product Backlog Refinement'],
    syllabus: [
      {
        title: 'Module 1: Scrum Values, Roles & Accountabilities',
        duration: '8 hours',
        lessons: [
          { id: 'scrum-l1', title: 'Origins of Agile and Scrum Framework', duration: '25 min', type: 'video', content: 'Unpacking the Agile Manifesto and core empiricism principles: transparency, inspection, and adaptation.' },
          { id: 'scrum-l2', title: 'Scrum Accountabilities: Scrum Master, Product Owner, Developers', duration: '40 min', type: 'video', content: 'Frictionless distribution of responsibilities. Avoiding typical anti-patterns like command-and-control masters.' },
          { id: 'scrum-l3', title: 'The Scrum Guide 2020 Revisions', duration: '30 min', type: 'reading', content: 'A meticulous breakdown of key Scrum Guide revisions: self-management, Product Goal, and sprint commitments.' },
          { id: 'scrum-l4', title: 'Accountabilities Quiz', duration: '15 min', type: 'quiz' }
        ]
      },
      {
        title: 'Module 2: Scrum Events, Artifacts, and Leadership',
        duration: '8 hours',
        lessons: [
          { id: 'scrum-l5', title: 'Facilitating Scrum Events with Impact', duration: '45 min', type: 'video', content: 'Best practices for Sprint Planning, Daily Scrum, Sprint Review, and Retrospectives.' },
          { id: 'scrum-l6', title: 'Managing Backlogs & Commitments', duration: '40 min', type: 'video', content: 'Collaborating on User Stories, setting Sprint Goals, tracking Definition of Done (DoD).' },
          { id: 'scrum-l7', title: 'Servant Leadership & Coaching agile teams', duration: '35 min', type: 'reading', content: 'Moving from a manager to a facilitator. How to handle dysfunctional team dynamics in corporate sprints.' },
          { id: 'scrum-l8', title: 'PSM I Practice Assessment', duration: '25 min', type: 'quiz' }
        ]
      }
    ]
  },
  {
    id: 'course-react-19',
    title: 'Advanced React 19 & Architecture Patterns',
    category: 'Software Engineering',
    level: 'Advanced',
    duration: '20 hours',
    lessonsCount: 9,
    rating: 4.9,
    reviewsCount: 198,
    instructor: 'Yassin Al-Amari',
    instructorTitle: 'Frontend Solutions Architect at Xebia',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
    description: 'Learn Advanced state management, server actions, concurrent rendering, hooks optimization, and build architectures in React 19 to construct lightning-fast web systems.',
    skillsAcquired: ['React 19 Server Actions', 'useTransition Opt', 'Suspense Layouts', 'Custom State Engines', 'Performance Diagnostics'],
    syllabus: [
      {
        title: 'Module 1: React 19 Compiler & Core Enhancements',
        duration: '10 hours',
        lessons: [
          { id: 'react-l1', title: 'Unpacking the React 19 Compiler (React Forget)', duration: '35 min', type: 'video', content: 'How the automatic compiler renders useMemo and useCallback redundant by analyzing scope boundaries.' },
          { id: 'react-l2', title: 'Streamlining Async operations with Action Hooks', duration: '45 min', type: 'video', content: 'Hands-on use of useTransition, useActionState, and useOptimistic for immediate UI state feedback.' },
          { id: 'react-l3', title: 'The new use() API and Suspense patterns', duration: '35 min', type: 'reading', content: 'Reading and loading dynamic data or context dynamically on demand using the native use() hook.' },
          { id: 'react-l4', title: 'React 19 Core Quiz', duration: '15 min', type: 'quiz' }
        ]
      },
      {
        title: 'Module 2: Advanced Architecture & Scaling',
        duration: '10 hours',
        lessons: [
          { id: 'react-l5', title: 'Designing Compound Components and Render Props', duration: '50 min', type: 'video', content: 'Building highly reusable visual design kits. Encapsulating behavior, state, and child styling patterns.' },
          { id: 'react-l6', title: 'State Engine optimization: Context vs Zustand vs Signals', duration: '40 min', type: 'video', content: 'Diagnosing unnecessary re-renders in deep trees and selecting the right state container for massive platforms.' },
          { id: 'react-l7', title: 'Vite Compilation and Production Bundling Tuning', duration: '30 min', type: 'reading', content: 'Splitting code, dynamic imports, and treeshaking assets to achieve excellent Core Web Vitals.' },
          { id: 'react-l8', title: 'Architectural Performance Quiz', duration: '20 min', type: 'quiz' }
        ]
      }
    ]
  },
  {
    id: 'course-product-roadmap',
    title: 'Domain Driven Design',
    category: 'Software Architecture',
    level: 'Advanced',
    duration: '14.5 Hours',
    lessonsCount: 7,
    rating: 4.75,
    reviewsCount: 156,
    instructor: 'Yassin Al-Amari',
    instructorTitle: 'Principal Architect at Xebia',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    description: 'Master the strategic patterns, bounded contexts, and tactical aggregate structures used by top-tier architectural consultants to handle complex business domains.',
    skillsAcquired: ['Bounded Contexts', 'Ubiquitous Language', 'Subdomains', 'Tactical Aggregates', 'Context Mapping'],
    syllabus: [
      {
        title: 'Module 1: Product Discovery and Value Mapping',
        duration: '9 hours',
        lessons: [
          { id: 'prod-l1', title: 'The Double Diamond Framework for Product Managers', duration: '30 min', type: 'video', content: 'Exploring discover, define, develop, and deliver cycles to guarantee commercial-market fit.' },
          { id: 'prod-l2', title: 'Collaborative User Story Mapping Workshops', duration: '45 min', type: 'video', content: 'Guiding cross-functional teams to build an end-to-end user flow skeleton, slicing it into incremental releases.' },
          { id: 'prod-l3', title: 'Impact Mapping: Connecting Tech to KPI Goals', duration: '35 min', type: 'reading', content: 'Declaring high-level strategic objectives, actors, impact vectors, and software deliverables.' }
        ]
      },
      {
        title: 'Module 2: Agile Prioritization & Enterprise Strategy',
        duration: '9 hours',
        lessons: [
          { id: 'prod-l4', title: 'Prioritization Frameworks: WSJF, MoSCoW, and Kano', duration: '50 min', type: 'video', content: 'Calculating cost of delay, risk reduction, and time criticality to compute WSJF numbers.' },
          { id: 'prod-l5', title: 'Writing Excellent User Stories with Clear Acceptance Criteria', duration: '40 min', type: 'video', content: 'Structuring features using INVEST rules. Authoring clear Gherkin (Given-When-Then) behavior syntax.' },
          { id: 'prod-l6', title: 'Product Leadership: Influencing Without Authority', duration: '30 min', type: 'reading', content: 'Communicating vision, negotiating with rigid corporate sponsors, and coaching software engineering leads.' },
          { id: 'prod-l7', title: 'Strategic Roadmap Assessment', duration: '20 min', type: 'quiz' }
        ]
      }
    ]
  }
];

export const SKILL_ASSESSMENTS: SkillAssessment[] = [
  {
    id: 'assess-cloud',
    title: 'AWS Architect Proficiency Assessment',
    category: 'Cloud',
    questionsCount: 5,
    questions: [
      {
        id: 'q-cl-1',
        question: 'Your enterprise application needs to withstand the failure of an entire AWS Availability Zone. Which VPC resource setup best delivers this?',
        options: [
          'A single public subnet tied to an Auto Scaling Group spanning all regions.',
          'Subnets created in multiple AZs, with an Application Load Balancer distributing traffic across them.',
          'A NAT Gateway deployed with Elastic IPs mapped to a single Private Subnet.',
          'Configuring VPC Peering between two private instances in the same zone.'
        ],
        correctIndex: 1,
        explanation: 'Multi-AZ subnets combined with an ALB ensures that if one Availability Zone encounters hardware outages, the load balancer reroutes ingress requests to healthy nodes in another AZ.'
      },
      {
        id: 'q-cl-2',
        question: 'You want to serve low-latency static assets globally while securing backend database assets. Which structural combo should you build?',
        options: [
          'VPC Peering with cross-region routing tables.',
          'Direct VPC endpoints mapped to public S3 buckets with ReadAll permissions.',
          'Amazon CloudFront distribution pointing to a private S3 bucket with Origin Access Control (OAC).',
          'Deploying proxy servers inside public subnets accessing secondary databases.'
        ],
        correctIndex: 2,
        explanation: 'CloudFront OAC restricts access so users can only fetch static objects via the CDN edge, optimizing download times while keeping the private S3 bucket isolated.'
      },
      {
        id: 'q-cl-3',
        question: 'Which AWS service provides serverless compute with auto-scaling based on incoming API Gateway request volume?',
        options: [
          'AWS Elastic Beanstalk',
          'Amazon EC2 with Launch Templates',
          'AWS Lambda',
          'Amazon ECS with EC2 capacity providers'
        ],
        correctIndex: 2,
        explanation: 'AWS Lambda is a serverless, event-driven compute service that runs your code in response to events and automatically manages the underlying compute resources.'
      },
      {
        id: 'q-cl-4',
        question: 'A database workload requires strict ACID compliance and frequent joint relational tables. Which service is optimal?',
        options: [
          'Amazon DynamoDB',
          'Amazon Aurora (RDS)',
          'Amazon ElastiCache',
          'Amazon Redshift'
        ],
        correctIndex: 1,
        explanation: 'Amazon Aurora is a fully managed MySQL and PostgreSQL compatible relational database engine, offering robust ACID compliance and relational join capabilities.'
      },
      {
        id: 'q-cl-5',
        question: 'How do you deploy your infrastructure repeatedly in different AWS regions safely as code?',
        options: [
          'Using the AWS CLI in a cron job schedule.',
          'Utilizing AWS CloudFormation templates.',
          'Manually cloning resources via the AWS Console.',
          'Deploying an EC2 backup AMI image.'
        ],
        correctIndex: 1,
        explanation: 'AWS CloudFormation is an Infrastructure as Code (IaC) tool that allows you to model and provision your AWS resources repeatedly and safely.'
      }
    ]
  },
  {
    id: 'assess-devops',
    title: 'Kubernetes Cluster Administrator Diagnostics',
    category: 'DevOps',
    questionsCount: 5,
    questions: [
      {
        id: 'q-do-1',
        question: 'A critical Pod is stuck in "Pending" state. You inspect the pod and see no event logs. What is the most probable cause?',
        options: [
          'The container lacks a start command.',
          'The scheduler cannot find any node meeting resource request requirements.',
          'The CNI network interface has dropped connection with etcd.',
          'The Pod lacks a ClusterRoleBinding configuration.'
        ],
        correctIndex: 1,
        explanation: 'A Pod remains "Pending" when the Kubernetes Scheduler cannot assign it to any node. This is commonly due to resource constraints (CPU/Memory requests) or node taints.'
      },
      {
        id: 'q-do-2',
        question: 'You want to route ingress web traffic to different backends based on the HTTP request path (e.g., /api vs /portal). Which Kubernetes object must you define?',
        options: [
          'A LoadBalancer type Service.',
          'An Ingress Resource with path rules pointing to respective services.',
          'Configuring CoreDNS upstream rules manually in the control plane.',
          'Creating a ClusterIP service with custom endpoints.'
        ],
        correctIndex: 1,
        explanation: 'An Ingress resource manages external access to the services in a cluster, typically HTTP, and can provide path-based routing, TLS termination, and virtual hosting.'
      },
      {
        id: 'q-do-3',
        question: 'Which component is responsible for storing the entire cluster state and configuration with high consistency?',
        options: [
          'kube-apiserver',
          'kube-scheduler',
          'etcd',
          'kube-controller-manager'
        ],
        correctIndex: 2,
        explanation: 'etcd is a consistent and highly-available key-value store used as Kubernetes back-end for all cluster data.'
      },
      {
        id: 'q-do-4',
        question: 'How do you prevent pods in a particular namespace from initiating network connections to pods in other namespaces?',
        options: [
          'Using Kubernetes NetworkPolicies with egress/ingress rules.',
          'Creating a separate VPC for each namespace.',
          'Configuring RBAC role permissions to block access.',
          'Deploying a separate CNI plugin for each namespace.'
        ],
        correctIndex: 0,
        explanation: 'NetworkPolicies are specifications of how groups of pods are allowed to communicate with each other and other network endpoints.'
      },
      {
        id: 'q-do-5',
        question: 'What is Helm in the Kubernetes ecosystem?',
        options: [
          'A container security monitoring tool.',
          'A package manager for deploying pre-configured Kubernetes charts.',
          'A CLI utility to inspect cluster container files.',
          'A virtual storage interface driver.'
        ],
        correctIndex: 1,
        explanation: 'Helm is the package manager for Kubernetes, enabling users to package, share, and deploy applications as reproducible charts.'
      }
    ]
  },
  {
    id: 'assess-agile',
    title: 'Professional Scrum Facilitator Assessment',
    category: 'Agile & Scrum',
    questionsCount: 5,
    questions: [
      {
        id: 'q-ag-1',
        question: 'During a Sprint, the Product Owner introduces an urgent security story that they want the developers to work on immediately. What should the Scrum Master do?',
        options: [
          'Directly add the story to the Sprint Backlog and tell developers to start working.',
          'Reject the request outright, as a Sprint Backlog is locked once planning ends.',
          'Facilitate a discussion between PO and Developers to review capacity, impact on the Sprint Goal, and negotiate trade-offs.',
          'Advise the PO to cancel the current Sprint and boot a new planning cycle.'
        ],
        correctIndex: 2,
        explanation: 'Scrum is empirical and flexible. While the Sprint Goal should not be compromised, the Product Owner and Developers can negotiate Sprint Backlog items if there is capacity or if other items are deferred.'
      },
      {
        id: 'q-ag-2',
        question: 'Who owns the Definition of Done (DoD) in a Scrum Team?',
        options: [
          'The Product Owner, since they define business value.',
          'The Scrum Master, since they guarantee process adherence.',
          'The Developers (or the organization if it is a standard), since they produce the increment.',
          'The Agile Project Manager.'
        ],
        correctIndex: 2,
        explanation: 'If the organizational standard does not declare a DoD, the Scrum Team’s Developers must define a Definition of Done appropriate for the product.'
      },
      {
        id: 'q-ag-3',
        question: 'What is the primary purpose of the Daily Scrum?',
        options: [
          'To report status to the Scrum Master and Product Owner.',
          'To inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary.',
          'To assign daily tasks to individual developers.',
          'To update JIRA boards and project management spreadsheets.'
        ],
        correctIndex: 1,
        explanation: 'The Daily Scrum is a 15-minute event for the Developers of the Scrum Team to inspect progress toward the Sprint Goal and adapt the Sprint Backlog, planning the next 24 hours.'
      },
      {
        id: 'q-ag-4',
        question: 'When is a Sprint Retrospective held?',
        options: [
          'At the beginning of every release cycle.',
          'After the Sprint Review and before the next Sprint Planning.',
          'Directly before the Sprint Review to prepare demo notes.',
          'Every morning before the Daily Scrum.'
        ],
        correctIndex: 1,
        explanation: 'The Sprint Retrospective concludes the current Sprint. It is held after the Sprint Review and before the next Sprint Planning.'
      },
      {
        id: 'q-ag-5',
        question: 'What does a Product Backlog Burnup chart primarily measure?',
        options: [
          'The individual coding speed of each developer.',
          'Work completed over time compared against total scope, showing progress and scope changes.',
          'The absolute storage volume of server logs.',
          'The budget spent in corporate software licenses.'
        ],
        correctIndex: 1,
        explanation: 'A Burnup chart tracks completed story points or tasks alongside the total scope of the backlog over time, clearly visualizing scope creep and estimated delivery dates.'
      }
    ]
  }
];

export const MOCK_EMPLOYEES: EmployeeProgress[] = [
  { id: 'emp-1', name: 'Liam Davies', email: 'liam.davies@xebia-learner.com', role: 'DevOps Engineer', department: 'Cloud Enablement', enrolledCount: 3, completedCount: 2, learningHours: 56, lastActive: '2026-07-12', completionRate: 85 },
  { id: 'emp-2', name: 'Sophia Chen', email: 'sophia.chen@xebia-learner.com', role: 'Senior React Developer', department: 'Digital Products', enrolledCount: 2, completedCount: 1, learningHours: 34, lastActive: '2026-07-11', completionRate: 65 },
  { id: 'emp-3', name: 'Marcus Aurel', email: 'marcus.a@xebia-learner.com', role: 'Solutions Architect', department: 'Enterprise Systems', enrolledCount: 4, completedCount: 4, learningHours: 96, lastActive: '2026-07-12', completionRate: 100 },
  { id: 'emp-4', name: 'Ananya Nair', email: 'ananya.n@xebia-learner.com', role: 'Product Owner', department: 'Agile Delivery', enrolledCount: 1, completedCount: 0, learningHours: 12, lastActive: '2026-07-10', completionRate: 35 },
  { id: 'emp-5', name: 'Dirk Bakker', email: 'dirk.bakker@xebia-learner.com', role: 'System Administrator', department: 'Infrastructure', enrolledCount: 2, completedCount: 1, learningHours: 28, lastActive: '2026-07-09', completionRate: 50 },
  { id: 'emp-6', name: 'Esther Vance', email: 'esther.vance@xebia-learner.com', role: 'AI Specialist', department: 'Data & AI', enrolledCount: 3, completedCount: 2, learningHours: 42, lastActive: '2026-07-12', completionRate: 75 }
];
