import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; // To convert import.meta.url to a file path
import getImagesForPdf from '../Library/Modules/getImagesFromPdf.mjs'; // Importing your local .mjs module
import { Server } from 'socket.io'
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
var SingleSocket = null;
io.on('connection', (socket) => {
    console.log('A client connected with ID:', socket.id);
    SingleSocket = socket
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A client disconnected:', socket.id);
        SingleSocket = null
    });
});

// Get the current directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);  // Get the file path of this module
const __dirname = path.dirname(__filename); // Extract the directory name from the file path

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const port = 3000;

// Set up the upload folder
const uploadFolder = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder); // Create the folder if it doesn't exist
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder); // Store files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Use the original file name with the extension
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid file name conflicts
    }
});
const upload = multer({ storage });

// Start the server
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Process the uploaded PDF file
    const filePath = req.file.path;

    try {
        // Call the `getImagesForPdf` function to process the PDF and get images
        const images = await getImagesForPdf(filePath,SingleSocket);
        console.log(images)
        //process(filePath, socket);
        res.json({
            message: 'File uploaded and Processed successfully!',
            file: req.file
        });
        // Respond with the uploaded file's info and the images extracted from the PDF
    } catch (err) {
        console.error('Error processing the PDF:', err);
        res.status(500).send('Error processing the PDF');
    }
});
