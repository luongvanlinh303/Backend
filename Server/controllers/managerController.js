const Manager = require('../models/managerModel');
module.exports = {
    getListGuard: async (req, res) => {
        try {
            const result = await Manager.getallGuard();
            return res.status(200).json(result);
          } catch (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'An error occurred' });
          } 
      },
    getListCustomer: async (req, res) => {
      try {
          const result = await Manager.getallCustomer();
          return res.status(200).json(result);
        } catch (err) {
          console.error('Error:', err);
          return res.status(500).json({ message: 'An error occurred' });
        } 
    },
    getAllBooking: async (req, res) => {
      try {
          const result = await Manager.getAllBooking();
          return res.status(200).json(result);
        } catch (err) {
          console.error('Error:', err);
          return res.status(500).json({ message: 'An error occurred' });
        } 
    },
    getDetailBooking: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const result = await Manager.getDetailBooking(bookingname);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getBookingPayment: async (req, res) => {
      try {
        const result = await Manager.getBookingPayment();
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getBookingNotPayment: async (req, res) => {
      try {
        const result = await Manager.getBookingNotPayment();
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getBookingDone: async (req, res) => {
      try {
        const result = await Manager.getBookingDone();
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    PickGuard: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const listguard = req.body.listguard;
        const result = await Manager.PickGuard(bookingname, listguard);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getGuardbyBookingname: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const result = await Manager.getGuardbyBookingname(bookingname);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    EditGuardBooking: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const listguard = req.body.listguard;
        const result = await Manager.EditGuardBooking(bookingname, listguard);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    DeleteAccount: async (req, res) => {
      try {
        const bookingname = req.params.bookingname;
        const listguard = req.body.listguard;
        const result = await Manager.DeleteAccount(bookingname, listguard);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    GetSalaryGuard: async (req, res) => {
      try {
        const guardid = req.params.guard_id;
        const result = await Manager.GetSalaryGuard(guardid);
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    getListGuardFree: async (req, res) => {
      try {
        const result = await Manager.getListGuardFree();
        return res.status(200).json(result);
      }
      catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'An error occurred' });
      } 
    },
    };