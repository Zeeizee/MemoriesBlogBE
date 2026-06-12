import express from 'express'
const router=express.Router();
import {getAllPosts,createNewPosts,delPosts,updatePosts,likePosts,getPostById} from '../controllers/post.js'
import { requireAuth } from '../middleware/auth.middleware.js'

router.get('/',getAllPosts)
router.get('/:id',getPostById)
router.patch('/likepost/:id',likePosts);
router.post('/', requireAuth, createNewPosts);
router.post('/deletepost', requireAuth, delPosts);
router.patch('/updatepost/:id', requireAuth, updatePosts);


export default router;