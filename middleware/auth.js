import  jwt  from 'jsonwebtoken'
import User from '../models/user.js'
const authMiddleware = async (req, res, next) => {
const authHeader = req.headers.authorization;
if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        req.userModel = await User.findById(decoded.id);
        next(); // Continue only if token is valid
    } catch (error) {
        return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }
} else {  
    return res.status(403).json({ success: false, message: "No token provided, authorization denied" });
}
}
export default authMiddleware;