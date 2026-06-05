# Videx - Video Streaming Platform

A modern video streaming platform where users can upload videos, view their uploaded content, and watch videos without authentication. Built with Express.js, MongoDB, and Pug templating.

## Features

✅ **No Login Required** - Simply click "JOIN" to get started  
✅ **Video Upload** - Upload videos with custom quality (360p, 720p, 1080p)  
✅ **Thumbnail Management** - Upload custom thumbnails for each video  
✅ **Form Validation** - Real-time validation with error messages  
✅ **File Previews** - See video and thumbnail previews before uploading  
✅ **Latest First** - Videos displayed in reverse chronological order  
✅ **Video Player** - Built-in video player with modal display  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **Drag & Drop** - Drag files directly into upload areas  

## Project Structure

```
├── index.js                 # Main server entry point
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables
├── models/
│   └── Video.js           # MongoDB Video schema
├── routes/
│   └── videoRoutes.js     # API and page routes
├── middleware/
│   └── upload.js          # Multer file upload configuration
├── views/
│   ├── index.pug          # Landing page
│   ├── videos.pug         # Videos listing page
│   ├── upload.pug         # Upload form page
│   ├── 404.pug            # 404 error page
│   └── error.pug          # Error page
├── public/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   └── js/
│       └── script.js      # Client-side JavaScript
└── uploads/               # Uploaded files directory
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup
Make sure MongoDB is running on your system:
- **Local MongoDB**: `mongodb://localhost:27017/videx`
- **MongoDB Atlas**: Update `MONGO_URI` in `.env`

### 3. Environment Variables
Edit `.env` file:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/videx
NODE_ENV=development
```

### 4. Start the Server

**Development (with auto-restart on file changes):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run at `http://localhost:3000`

## Usage

### Landing Page
1. Visit `http://localhost:3000`
2. Click the "JOIN" button to proceed

### Upload Video
1. Click "+ Upload Video" button
2. Fill in the form:
   - **Title** - Video title (min 3 characters)
   - **Description** - Video description (min 5 characters)
   - **Quality** - Select 360p, 720p, or 1080p
   - **Category** - Video category (e.g., Gaming, Music)
   - **Tags** - Comma-separated tags
   - **Video File** - Upload or drag video file
   - **Thumbnail** - Upload or drag thumbnail image
3. Click "Upload Video"
4. Form will reset and show success message
5. Redirected to videos page

### View Videos
1. All uploaded videos are displayed on `/videos`
2. Latest videos appear first
3. Click any video card to watch
4. Video player shows full details (title, quality, category, tags, description)

## Form Validation

The application includes comprehensive form validation:

- **Required Fields**: All fields show "required field" error if empty
- **Title**: Min 3 characters
- **Description**: Min 5 characters
- **Video File**: Max 500MB, accepts MP4, MPEG, MOV, AVI
- **Thumbnail**: Max 500MB, accepts JPEG, PNG, GIF
- **Real-time Feedback**: Errors clear as you type/fix them

## Button Hover Effects

- **Upload Button**: Changes color on hover with white effect
- **JOIN Button**: Scales up and changes color on landing page
- **Video Cards**: Lift up with shadow on hover
- **Smooth Transitions**: All interactions have smooth CSS transitions

## File Upload Features

- **Drag & Drop Support**: Drag files into upload areas
- **File Previews**: See video/thumbnail before uploading
- **Progress Indication**: Button shows "Uploading..." during upload
- **Error Handling**: Clear error messages for upload issues
- **File Size Display**: Shows file size in MB/KB

## API Endpoints

### Pages
- `GET /` - Landing page
- `GET /videos` - Videos listing page
- `GET /upload` - Upload form page

### API Routes
- `POST /api/upload` - Upload video and thumbnail
- `GET /api/video/:id` - Get single video details
- `DELETE /api/video/:id` - Delete a video

## Styling

The application features:
- Modern gradient backgrounds
- Responsive grid layout
- Card-based video display
- Modal-based video player
- Mobile-friendly design
- Smooth animations and transitions

## Error Handling

- 404 page for non-existent routes
- Error page for server errors
- Form validation with inline error messages
- File upload error messages
- Database connection error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Try: `mongod` to start MongoDB locally

### Uploads Not Showing
- Check `./uploads` directory exists
- Ensure write permissions in project directory
- Check file paths in browser console

### Validation Not Working
- Clear browser cache
- Ensure `script.js` is loaded (check DevTools)
- Verify JavaScript is enabled

## Performance Notes

- Max file size: 500MB per file
- Multer stores files on disk
- Consider cloud storage (AWS S3, Firebase) for production
- MongoDB indexes recommended for large datasets

## Future Enhancements

- User accounts and authentication
- Video search and filtering
- Comments and likes
- Video editing features
- Social sharing
- Analytics dashboard
- Video transcoding for different qualities
- CDN integration for streaming

## License

ISC

## Author

Acayo Siama Ismail
