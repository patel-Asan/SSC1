import fs from 'fs';
import path from 'path';

const testUploadDirectory = () => {
  try {
    console.log('🧪 Testing upload directory...');
    
    const uploadsDir = path.join(process.cwd(), 'uploads');
    console.log('📁 Uploads directory path:', uploadsDir);
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory');
    } else {
      console.log('✅ Uploads directory already exists');
    }
    
    // List files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    console.log('📄 Files in uploads directory:', files);
    
    console.log('✅ Upload directory test completed');
    
  } catch (error) {
    console.error('❌ Upload directory test failed:', error.message);
  }
};

testUploadDirectory(); 