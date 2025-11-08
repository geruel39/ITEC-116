import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
    constructor(private db: DatabaseService, private jwtService: JwtService) {}
    

    async register(username: string, password: string) {

        console.log('Hello');

        try {
            
            const rows: any = await this.db.query(
                'SELECT * FROM accounts WHERE username = ?',
                [username],
            );

            if (rows.length > 0) {
                return { message: 'Username already exist!', success: false };
            }

            const hashed = await bcrypt.hash(password, 10);

            await this.db.query(
            'INSERT INTO accounts (username, password) VALUES (?, ?)',
            [username, hashed],
            );

            return { message: 'Register Successfully', success: true };
        } catch (err) {
            console.error('❌ Register error:', err);
            return {
                success: false,
                message: 'Something went wrong during registration',
            };
        }
    }


    async login(username: string, password: string) {
        const users: any = await this.db.query('SELECT * FROM accounts WHERE username = ? LIMIT 1', [username],);

        if(users.lenght === 0){
            return { message: "Invalid Credentials", success: false }
            
        }

        const user = users[0];
        const valid = await bcrypt.compare(password, user.password);

        if(!valid) {
            return { message: "Invalid Credentials", success: false }
            
        }

        const payload = {sub: user.userID, username: user.username};
        return { access_token: this.jwtService.sign(payload), success: true }
    }

    async changePassword(userId: number, oldPassword: string, newPassword: string) {
        try {
            const users: any = await this.db.query('SELECT * FROM accounts WHERE userID = ? LIMIT 1', [userId]);
            if (!users || users.length === 0) {
                return { success: false, message: 'User not found' };
            }

            const user = users[0];
            const valid = await bcrypt.compare(oldPassword, user.password);
            if (!valid) {
                return { success: false, message: 'Current password is incorrect' };
            }

            const hashed = await bcrypt.hash(newPassword, 10);
            await this.db.query('UPDATE accounts SET password = ? WHERE userID = ?', [hashed, userId]);
            return { success: true, message: 'Password updated successfully' };
        } catch (err) {
            console.error('Change password error:', err);
            return { success: false, message: 'Failed to change password' };
        }
    }

}
 