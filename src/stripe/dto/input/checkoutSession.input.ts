import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckoutSession {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
