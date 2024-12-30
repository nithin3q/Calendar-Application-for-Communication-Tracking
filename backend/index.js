const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/calendarApp')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Company schema
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  linkedInProfile: String,
  emails: [String],
  phoneNumbers: [String],
  comments: String,
  communicationPeriodicity: String,
  lastCommunications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Communication',
  }],
  nextCommunication: String,
});

// Define CommunicationMethod schema (Admin will manage this)
const communicationMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  sequence: { type: Number, required: true },
  mandatory: { type: Boolean, default: false },
});

// Define Communication schema to track communication actions
const communicationSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  communicationType: { type: String, required: true },
  communicationDate: { type: String, required: true },
  notes: String,
  nextCommunication: String,
});

// Define NextCommunication schema
const nextCommunicationSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  communicationType: { type: String, required: true },
  scheduledDate: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const NextCommunication = mongoose.model('NextCommunication', nextCommunicationSchema);


// Models
const Company = mongoose.model('Company', companySchema);
const CommunicationMethod = mongoose.model('CommunicationMethod', communicationMethodSchema);
const Communication = mongoose.model('Communication', communicationSchema);

// API Endpoints

// Fetch all communication methods
app.get('/api/communication-methods', async (req, res) => {
  try {
    const methods = await CommunicationMethod.find().sort('sequence');
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communication methods', error });
  }
});

// Add a new communication method (Admin only)
app.post('/api/communication-methods', async (req, res) => {
  try {
    const method = new CommunicationMethod(req.body);
    await method.save();
    res.status(201).json({ message: 'Communication method added successfully', method });
  } catch (error) {
    res.status(400).json({ message: 'Error adding communication method', error });
  }
});

// Update an existing communication method (Admin only)
app.put('/api/communication-methods/:id', async (req, res) => {
  try {
    const updatedMethod = await CommunicationMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMethod) return res.status(404).json({ message: 'Communication method not found' });
    res.status(200).json({ message: 'Communication method updated successfully', updatedMethod });
  } catch (error) {
    res.status(400).json({ message: 'Error updating communication method', error });
  }
});

// Delete a communication method (Admin only)
app.delete('/api/communication-methods/:id', async (req, res) => {
  try {
    const deletedMethod = await CommunicationMethod.findByIdAndDelete(req.params.id);
    if (!deletedMethod) return res.status(404).json({ message: 'Communication method not found' });
    res.status(200).json({ message: 'Communication method deleted successfully', deletedMethod });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting communication method', error });
  }
});

// Fetch companies with last and next communication details for user dashboard
// app.get('/api/user-dashboard', async (req, res) => {
//   try {
//     const companies = await Company.find().populate('lastCommunications');
//     const data = companies.map(company => ({
//       id: company._id,
//       name: company.name,
//       lastFiveCommunications: company.lastCommunications.slice(-5),
//       nextCommunication: company.nextCommunication,
//     }));
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user dashboard data', error });
//   }
// });

// Fetch all companies
// app.get('/api/companies', async (req, res) => {
//   try {
//     const companies = await Company.find();
//     res.status(200).json(companies);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching companies', error });
//   }
// });

// Fetch a single communication by ID
app.get('/api/communications/:id', async (req, res) => {
  try {
    const communication = await Communication.findById(req.params.id);
    if (!communication) {
      return res.status(404).json({ message: 'Communication not found' });
    }
    res.status(200).json(communication);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communication', error });
  }
});


// Fetch companies with populated lastCommunications


app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.find().populate('lastCommunications');
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error });
  }
});

// Fetch companies with last and next communication details for the user dashboard
app.get('/api/user-dashboard', async (req, res) => {
  try {
    const companies = await Company.find().populate('lastCommunications');
    const data = companies.map(company => ({
      id: company._id,
      name: company.name,
      lastFiveCommunications: company.lastCommunications.slice(-5),
      nextCommunication: company.nextCommunication,
    }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user dashboard data', error });
  }
});

// Fetch a single company by ID
app.get('/api/companies/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('lastCommunications');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company', error });
  }
});

// Add a new company
app.post('/api/companies', async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json({ message: 'Company added successfully', company });
  } catch (error) {
    res.status(400).json({ message: 'Error adding company', error });
  }
});

// Update an existing company
app.put('/api/companies/:id', async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCompany) return res.status(404).json({ message: 'Company not found' });
    res.status(200).json({ message: 'Company updated successfully', updatedCompany });
  } catch (error) {
    res.status(400).json({ message: 'Error updating company', error });
  }
});

// Delete a company
app.delete('/api/companies/:id', async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) return res.status(404).json({ message: 'Company not found' });
    res.status(200).json({ message: 'Company deleted successfully', deletedCompany });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting company', error });
  }
});

// Log a new communication action for a company
app.post('/api/communications', async (req, res) => {
  const { companyId, communicationType, communicationDate, notes, nextCommunication } = req.body;

  try {
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const communication = new Communication({
      companyId,
      communicationType,
      communicationDate,
      notes,
      nextCommunication,
    });

    await communication.save();

    company.lastCommunications.push(communication._id);
    company.nextCommunication = nextCommunication || null;

    await company.save();

    // Return the updated company data
    const updatedCompany = await Company.findById(companyId).populate('lastCommunications');
    res.status(200).json({ message: 'Communication logged successfully', updatedCompany });
  } catch (error) {
    res.status(400).json({ message: 'Error logging communication', error });
  }
});

// delete a communication
app.delete('/api/communications/:id', async (req, res) => {
  try {
    const deletedCommunication = await Communication.findByIdAndDelete(req.params.id);
    if (!deletedCommunication) return res.status(404).json({ message: 'Communication not found' });
    res.status(200).json({ message: 'Communication deleted successfully', deletedCommunication });  
  } catch (error) {
    res.status(500).json({ message: 'Error deleting communication', error });
  }
});
// Create next communication
app.post('/api/next-communications', async (req, res) => {
  try {
    const nextComm = new NextCommunication(req.body);
    await nextComm.save();
    res.status(201).json(nextComm);
  } catch (error) {
    res.status(400).json({ message: 'Error creating next communication', error });
  }
});



// Get next communications for a company
app.get('/api/next-communications/:companyId', async (req, res) => {
  try {
    const nextComms = await NextCommunication.find({
      companyId: req.params.companyId,
      isCompleted: false
    });
    res.status(200).json(nextComms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching next communications', error });
  }
});

app.put('/api/next-communications/:id', async (req, res) => {
  try {
    const updated = await NextCommunication.findByIdAndUpdate(
      req.params.id,
      {
        communicationType: req.body.communicationType,
        scheduledDate: req.body.scheduledDate,
        isCompleted: false
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating next communication', error });
  }
});

// Cancel next communication
app.delete('/api/next-communications/:id', async (req, res) => {
  try {
    const deleted = await NextCommunication.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.status(200).json({ message: 'Schedule cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling schedule', error });
  }
});


// Get all active schedules
app.get('/api/next-communications', async (req, res) => {
  try {
    const schedules = await NextCommunication.find({ isCompleted: false });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules', error });
  }
});


// Server initialization
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
