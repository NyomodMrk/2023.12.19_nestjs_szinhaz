import { Controller, Get, Render, Post } from '@nestjs/common';
import * as mysql from 'mysql2';
import { AppService } from './app.service';
import { newcouponDto } from './newcouponDTO';

const conn = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'database',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }

  @Get('/newCoupon')
  @Render('newCoupon')
  newCoupon() {
    return { title: 'Új kupon felvétele' };
  }

  @Post('/newCoupon')
  async newCoupon(@Body() newcoupon: newcouponDto) {
    const title = newcoupon.title;
    const percentage = newcoupon.percentage;
    const kod = newcoupon.kod;
    const [ adatok ] = await conn.execute(
      'INSERT INTO jegyek (title, percentage, kod) VALUES (?, ?, ?)',
      [title, percentage, kod],
    );
    console.log(adatok);
    return {};
  }
}
