export type CarType = 'MPV' | 'SUV' | 'Sedan' | 'Pickup' | 'Sports';

export interface Car {
  id: string;
  fileName: string;
  name: string;
  type: CarType;
  dailyPrice: number;
  mileage: number;
  stock: number;
  image: string;
}

export interface NewCarInput {
  name: string;
  type: CarType;
  dailyPrice: number;
  mileage: number;
  stock: number;
  image: string;
}
