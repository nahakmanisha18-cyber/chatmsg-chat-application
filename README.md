# ChatMsg

ChatMsg is a full-stack real-time chat application designed to provide a simple and interactive messaging experience with one-to-one and group conversations.

## Project Description

ChatMsg is built with **React + Vite** on the frontend and **Node.js + Express** on the backend. The application provides authentication, one-to-one chat, group chat, text messaging, image sharing, and emoji messaging.

## Project Status

> 🚧 **This project is currently under development.**

This repository contains the current working version of ChatMsg. Some planned chat functionalities have not been implemented yet and are listed under [Future Enhancements](#future-enhancements).

## Features

### Authentication
- User registration
- User login
- JWT-based authentication
- Authentication middleware
- Form validation

### One-to-One Chat
- Single user chat
- Send text messages
- Send images
- Send emojis
- Chat conversation interface
- Message input
- Emoji picker
- Image preview before sending
- Multiple image selection

### Group Chat
- Create groups
- Group chat
- Send text messages in groups
- Send images in groups
- Send emojis in groups
- Group chat interface

### Media
- Image upload
- Image preview
- Multiple image selection
- Cloudinary integration for image storage

## Technologies Used

### Frontend

| Technology | Purpose |
|---|---|
| React.js | UI library |
| Vite | Build tool and dev server |
| JavaScript | Programming language |
| Axios | HTTP requests |
| Redux Toolkit | State management |
| React Router | Routing |
| Socket.io Client | Client-side socket connection |
| React Icons | Icons |
| Emoji Picker React | Emoji picker |
| Bootstrap | UI styling |
| CSS | Custom styling |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Server framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| Socket.io | Socket communication |
| Cloudinary | Image storage |
| Multer | File upload handling |

## Project Structure

```
chat-application/
│
├── client/
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── axios.js
│       ├── assets/
│       ├── components/
│       │   ├── Chat/
│       │   │   ├── ChatHeader.jsx
│       │   │   ├── ChatMessages.jsx
│       │   │   ├── ChatWindow.jsx
│       │   │   ├── ContactEmpty.jsx
│       │   │   ├── ContactInfo.jsx
│       │   │   ├── ConversationItem.jsx
│       │   │   ├── ConversationList.jsx
│       │   │   ├── CreateGroup.jsx
│       │   │   ├── EmptyChat.jsx
│       │   │   ├── GroupChatMessages.jsx
│       │   │   ├── GroupChatWindow.jsx
│       │   │   ├── GroupEmpty.jsx
│       │   │   ├── GroupMessageBubble.jsx
│       │   │   ├── ImageViewer.jsx
│       │   │   ├── MessageBubble.jsx
│       │   │   ├── MessageInput.jsx
│       │   │   ├── ProfileEmpty.jsx
│       │   │   └── Sidebar.jsx
│       │   └── Header.jsx
│       ├── pages/
│       │   ├── ChatMsg.jsx
│       │   ├── Contacts.jsx
│       │   ├── Groups.jsx
│       │   ├── Login.jsx
│       │   ├── Messages.jsx
│       │   ├── Profile.jsx
│       │   └── Register.jsx
│       ├── redux/
│       ├── services/
│       │   └── imageUpload.js
│       ├── socket/
│       │   └── socket.js
│       ├── style/
│       ├── utils/
│       │   └── validate.js
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── dbConnect.js
│   ├── controllers/
│   │   ├── auth.Controller.js
│   │   ├── conversation.Controller.js
│   │   ├── group.controller.js
│   │   ├── groupMessage.controller.js
│   │   ├── message.Controller.js
│   │   └── user.Controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validator.middleware.js
│   ├── model/
│   │   ├── conversation.model.js
│   │   ├── group.model.js
│   │   ├── groupMessage.model.js
│   │   ├── message.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── conversation.routes.js
│   │   ├── group.routes.js
│   │   ├── groupMessage.routes.js
│   │   ├── message.routes.js
│   │   └── user.routes.js
│   ├── socket/
│   │   └── socket.js
│   └── .env
│
└── README.md
```

## Application Flow

1. A new user registers, and the input is checked by form validation.
2. The user logs in and receives a JWT, which is used to authenticate requests.
3. Protected routes on the server are secured by the authentication middleware.
4. The user opens a one-to-one conversation or creates/opens a group.
5. Text messages, emojis, and images are sent from the message input. Images can be previewed before sending, and multiple images can be selected.
6. Images are handled by Multer on the server and stored on Cloudinary.
7. Messages and conversations are stored in MongoDB using Mongoose models.

## Installation & Setup

### Prerequisites
- Node.js and npm
- A MongoDB database
- A Cloudinary account

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd chat-application
```

### 2. Client Setup

```bash
cd client
npm install
```

### 3. Server Setup

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file inside the `server/` directory and add the following placeholders, replacing them with your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> ⚠️ **Do not commit the `.env` file to GitHub.**

## Running the Project

Start the server (from the `server/` directory):

```bash
npm start
```

Start the client (from the `client/` directory):

```bash
npm run dev
```

> If your server uses a different start script, use the one defined in `server/package.json`.

## Currently Implemented Features

- User registration and login with JWT authentication
- Authentication middleware and form validation
- One-to-one chat with text, image, and emoji messages
- Emoji picker, image preview, and multiple image selection
- Group creation and group chat with text, image, and emoji messages
- Image upload with Cloudinary storage

## Future Enhancements

The following features are planned but are **not yet fully implemented**:

- Video calling
- Audio calling
- Document/file sharing
- Typing indicator
- Online/offline status
- Message reactions
- Reply to messages
- Edit messages
- Delete messages
- Message search
- User search
- Notifications
- Group admin controls
- Add/remove group members
- Leave group
- Advanced Socket.io real-time features
- Additional profile functionality
- Further responsive/mobile improvements

## Screenshots

_Screenshots will be added here._

## Author

**Nahak Manisha**

## License

No license has been specified for this project yet.

---

**Author:** Nahak Manisha  
**Project:** ChatMsg  
**Status:** In Development
