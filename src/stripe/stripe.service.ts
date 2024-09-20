import {
  HttpException,
  Injectable,
} from '@nestjs/common';
import { CheckoutSession } from './dto/input/checkoutSession.input';
import { User, UserDocument } from 'src/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
const Stripe = require('stripe');
import { Model } from 'mongoose';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

  ) { }

  async createCustomer(name: string, email: string): Promise<{ id: string }> {
    try {
      const customers = await this.stripe.customers.list({
        email,
        limit: 1,
      });

      if (customers?.data?.length > 0) {
        return { id: customers.data[0].id };
      }
      const customer = await this.stripe.customers.create({
        name,
        email,
      });

      return customer;
    } catch (error) {
      throw new HttpException('Error While creating customer', error);
    }
  }

  async createCheckoutSessionForTickets(
    checkoutSession: CheckoutSession,
  ): Promise<void> {
    const { name, email, amount } = checkoutSession;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = await this.userModel.create({ name, email });
    }

    let stripeCustomer = user.stripeCustomerId;
    if (!stripeCustomer) {
      const customer = await this.createCustomer(`${user.name}`, user.email);
      user.stripeCustomerId = customer?.id;
      await user.save();
  
      stripeCustomer = customer?.id;
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        success_url: `${process.env.STRIPE_SUCCESS_URL}`,
        line_items: [
          {
            price_data: {
              unit_amount: amount * 100,
              currency: 'usd',
              product_data: {
                name: "donation"
              },
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer: stripeCustomer,
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: [
            'AC',
            'AD',
            'AE',
            'AF',
            'AG',
            'AI',
            'AL',
            'AM',
            'AO',
            'AQ',
            'AR',
            'AT',
            'AU',
            'AW',
            'AX',
            'AZ',
            'BA',
            'BB',
            'BD',
            'BE',
            'BF',
            'BG',
            'BH',
            'BI',
            'BJ',
            'BL',
            'BM',
            'BN',
            'BO',
            'BQ',
            'BR',
            'BS',
            'BT',
            'BV',
            'BW',
            'BY',
            'BZ',
            'CA',
            'CD',
            'CF',
            'CG',
            'CH',
            'CI',
            'CK',
            'CL',
            'CM',
            'CN',
            'CO',
            'CR',
            'CV',
            'CW',
            'CY',
            'CZ',
            'DE',
            'DJ',
            'DK',
            'DM',
            'DO',
            'DZ',
            'EC',
            'EE',
            'EG',
            'EH',
            'ER',
            'ES',
            'ET',
            'FI',
            'FJ',
            'FK',
            'FO',
            'FR',
            'GA',
            'GB',
            'GD',
            'GE',
            'GF',
            'GG',
            'GH',
            'GI',
            'GL',
            'GM',
            'GN',
            'GP',
            'GQ',
            'GR',
            'GS',
            'GT',
            'GU',
            'GW',
            'GY',
            'HK',
            'HN',
            'HR',
            'HT',
            'HU',
            'ID',
            'IE',
            'IL',
            'IM',
            'IN',
            'IO',
            'IQ',
            'IS',
            'IT',
            'JE',
            'JM',
            'JO',
            'JP',
            'KE',
            'KG',
            'KH',
            'KI',
            'KM',
            'KN',
            'KR',
            'KW',
            'KY',
            'KZ',
            'LA',
            'LB',
            'LC',
            'LI',
            'LK',
            'LR',
            'LS',
            'LT',
            'LU',
            'LV',
            'LY',
            'MA',
            'MC',
            'MD',
            'ME',
            'MF',
            'MG',
            'MK',
            'ML',
            'MM',
            'MN',
            'MO',
            'MQ',
            'MR',
            'MS',
            'MT',
            'MU',
            'MV',
            'MW',
            'MX',
            'MY',
            'MZ',
            'NA',
            'NC',
            'NE',
            'NG',
            'NI',
            'NL',
            'NO',
            'NP',
            'NR',
            'NU',
            'NZ',
            'OM',
            'PA',
            'PE',
            'PF',
            'PG',
            'PH',
            'PK',
            'PL',
            'PM',
            'PN',
            'PR',
            'PS',
            'PT',
            'PY',
            'QA',
            'RE',
            'RO',
            'RS',
            'RU',
            'RW',
            'SA',
            'SB',
            'SC',
            'SE',
            'SG',
            'SH',
            'SI',
            'SJ',
            'SK',
            'SL',
            'SM',
            'SN',
            'SO',
            'SR',
            'SS',
            'ST',
            'SV',
            'SX',
            'SZ',
            'TA',
            'TC',
            'TD',
            'TF',
            'TG',
            'TH',
            'TJ',
            'TK',
            'TL',
            'TM',
            'TN',
            'TO',
            'TR',
            'TT',
            'TV',
            'TW',
            'TZ',
            'UA',
            'UG',
            'US',
            'UY',
            'UZ',
            'VA',
            'VC',
            'VE',
            'VG',
            'VN',
            'VU',
            'WF',
            'WS',
            'XK',
            'YE',
            'YT',
            'ZA',
            'ZM',
            'ZW',
            'ZZ',
          ],
        },
        invoice_creation: {
          enabled: true,
        },
      });
      return session;
    } catch (error) {
      throw new HttpException('Error While creating session', error);
    }
  }
}
