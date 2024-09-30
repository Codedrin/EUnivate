  import mongoose from 'mongoose';

  const eventSchema = new mongoose.Schema({
    webinarName: { type: String, required: true },
    description: { type: String, required: true },
    dateAndTime: { type: String, required: true },
    embeddedLink: { type: String, required: true },
    image: { 
      publicId: { 
        type: String, 
        required: true 
      },
      url: { 
        type: String, 
        required: true 
      }
    }
  }, { timestamps: true });

  const Event = mongoose.model('Event', eventSchema);

  export default Event;
