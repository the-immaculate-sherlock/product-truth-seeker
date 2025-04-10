
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBlockchain } from '../contexts/BlockchainContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Form schema using zod
const formSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  manufacturingDate: z.string().min(1, 'Manufacturing date is required'),
  batchNumber: z.string().min(1, 'Batch number is required'),
  location: z.string().min(1, 'Manufacturing location is required'),
  additionalDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterProduct = () => {
  const { isConnected, connectWallet, registerProduct } = useBlockchain();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredProduct, setRegisteredProduct] = useState<null | {
    hash: string;
    name: string;
    manufacturingDate: string;
    batchNumber: string;
  }>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      manufacturingDate: new Date().toISOString().split('T')[0],
      batchNumber: '',
      location: '',
      additionalDetails: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!isConnected) {
      toast.info('Connecting to wallet...');
      const connected = await connectWallet();
      if (!connected) {
        toast.error('Please connect your MetaMask wallet to register a product');
        return;
      }
    }

    setIsRegistering(true);
    toast.info('Registering product on blockchain. Please confirm the transaction in MetaMask...');

    try {
      const result = await registerProduct(
        data.name,
        data.manufacturingDate,
        data.batchNumber,
        data.location,
        data.additionalDetails || ''
      );

      if (result.success && result.hash) {
        toast.success('Product registered successfully on the blockchain!');
        
        setRegisteredProduct({
          hash: result.hash,
          name: data.name,
          manufacturingDate: data.manufacturingDate,
          batchNumber: data.batchNumber,
        });
      } else {
        toast.error(result.error || 'Failed to register product');
      }
    } catch (error) {
      console.error('Error registering product:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Register New Product</h1>
            
            {!registeredProduct ? (
              <Card>
                <CardHeader>
                  <CardTitle>Product Registration Form</CardTitle>
                  <CardDescription>
                    Enter the product details to register on the blockchain and generate a unique QR code.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter product name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="manufacturingDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manufacturing Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="batchNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter batch number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manufacturing Location</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter manufacturing location" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="additionalDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Details (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Enter any additional product details"
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-blockchain-primary hover:bg-blockchain-secondary"
                          disabled={isRegistering}
                        >
                          {isRegistering ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                              Registering...
                            </>
                          ) : (
                            'Register Product'
                          )}
                        </Button>
                        
                        {!isConnected && !isRegistering && (
                          <p className="mt-2 text-sm text-center text-amber-600">
                            You will be prompted to connect your wallet when registering
                          </p>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Product Registered Successfully</CardTitle>
                  <CardDescription>
                    Your product has been registered on the blockchain. Use the QR code below for product authentication.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="mb-6">
                    <QRCodeGenerator productData={registeredProduct} />
                  </div>
                  
                  <div className="mt-4 w-full max-w-md">
                    <p className="text-center mb-6">
                      Print this QR code and attach it to your product for authentication
                    </p>
                    
                    <Button 
                      onClick={() => setRegisteredProduct(null)} 
                      className="w-full"
                    >
                      Register Another Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterProduct;
