## 💼 Company: CODTECH IT SOLUTIONS
##  Name: NEHASRI H
##  Intern Id: CT08DM1117
##  Domain: MERN STACK WEB DEVELOPMENT
##  Duration: 8 WEEKS
##  Mentor:NEELA SANTHOSH
 
##  Project Task Description — ChatConnect

As part of this task, I independently developed a real-time messaging web application named **ChatConnect**. The project aimed to deliver a fully functional, interactive, and responsive chat platform that allows multiple users to connect and exchange messages in real time. I followed a full-stack approach using modern web technologies and deployed the final product online.

### Objective  
The primary goal was to create a robust and scalable messaging app that enables users to join a shared chat room and send messages instantly. The application had to support real-time communication, provide a smooth user experience, and be compatible across different devices, including desktops and smartphones. Clean UI design and fast performance were also key objectives.

###  Development Process  

#### Frontend Development  
I developed the frontend using **React.js**, focusing on component-based architecture for maintainability and scalability. Styling was done entirely using **custom CSS**, ensuring a unique visual identity without relying on libraries like Tailwind or Bootstrap.  

Key features of the frontend include:  
- A **Join Screen** where users can enter their name, choose an avatar, and optionally provide their country and status  
- A **Chat Interface** that displays messages in real-time, with auto-scrolling behavior and timestamp formatting  
- A **Top Navigation Bar** that displays the logged-in user's details and a logout button  
- Responsive layout using CSS media queries to support both desktop and mobile views  

Routing and state management were handled using React hooks like `useState`, `useEffect`, and `useRef`. Socket connections were maintained throughout the session using **Socket.IO Client**.

#### Backend Development  
The backend was built using **Node.js** and **Express.js**. It handled routing, socket communication, and cross-origin resource sharing using the **CORS middleware**. The server maintained a list of connected users and ensured that messages were correctly broadcast to all active clients.

Server-side responsibilities included:  
- Handling **user join and disconnect** events  
- Broadcasting chat messages using **Socket.IO**  
- Managing unique socket sessions for real-time delivery  

#### WebSocket Integration  
Real-time functionality was achieved using **Socket.IO** on both client and server sides. This allowed for continuous, low-latency communication between users without the need for page refresh. Events such as `message`, `user-connected`, and `disconnect` were implemented to synchronize chat activity.

#### Deployment  
- The **frontend** was deployed on **Vercel**, taking advantage of its CI/CD pipeline and global CDN for fast loading times  
- The **backend** was hosted on **Render**, a cloud platform that supports automatic deployments and dynamic backend environments  

I configured environment variables in both frontend and backend to securely connect the client with the live server.

#### Testing & Debugging  
Thorough manual testing was carried out to verify performance, responsiveness, and functionality. Key areas tested include:
- Instant message delivery and receipt across multiple browser instances  
- Interface behavior on different screen sizes  
- Input validation on the join screen  
- Socket stability during frequent connect/disconnect cycles  

###  Outcome  
The final version of **ChatConnect** is a cloud-deployed, real-time messaging platform with a clean interface, reliable performance, and mobile responsiveness. The project helped me strengthen my skills in full-stack development, WebSocket communication, and cloud deployment practices.
