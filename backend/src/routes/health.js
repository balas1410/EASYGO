import { Router } from 'express';
import { pool } from '../config/db.js';
const router=Router();
router.get('/', async(_req,res,next)=>{try{await pool.query('SELECT 1');res.json({success:true,app:'EASY GO',status:'online',database:'connected',timestamp:new Date().toISOString()});}catch(e){next(e);}});
export default router;
