declare module 'paymongo-node' {
  class Paymongo {
    constructor(secretKey: string);
    
    paymentIntents: {
      create: (data: any) => Promise<any>;
      retrieve: (id: string) => Promise<any>;
    };
    
    paymentMethods: {
      create: (data: any) => Promise<any>;
      retrieve: (id: string) => Promise<any>;
    };
  }
  
  export default Paymongo;
}
