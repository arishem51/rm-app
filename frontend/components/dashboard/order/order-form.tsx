import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Form,
} from "@/components/ui/form";
import {
    Order,
    CreateOrderDTO,
    BaseResponseListInventory,
    BaseResponseListPartner,
} from "@/types/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useCreateOrder, useUpdateOrder } from "@/hooks/mutations/order";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ToastTitle } from "@/lib/constants";
import { ApiQuery } from "@/services/query";
import useAppQuery from "@/hooks/use-app-query";
import { useRouter } from "next/navigation";

const schemaFields = {
    partnerId: z.string().nonempty({ message: "Chọn khách hàng là bắt buộc" }),
};

const OrderForm = ({
    partners,
    order,
    inventory,
    onClose,
}: {
    partners: BaseResponseListPartner;
    inventory: BaseResponseListInventory | undefined;
    order?: Order;
    onClose?: () => void;
}) => {
    const form = useForm<CreateOrderDTO>({
        defaultValues: order
            ? { ...order, products: order.products || [] }
            : { products: [] },
        resolver: zodResolver(z.object(schemaFields)),
    });
    const [isDebtOrder, setIsDebtOrder] = useState(false);
    const { mutate: createOrder } = useCreateOrder();
    const updateOrder = useUpdateOrder();
    const queryClient = useQueryClient();
    const [selectedProducts, setSelectedProducts] = useState(
        order?.products || []
    );
    const [needsLoadingService, setNeedsLoadingService] = useState(false);
    const router = useRouter();
    const handleProductChange = (productId: number, quantity: number) => {
        const updatedProducts = selectedProducts.filter(
            (p) => p.productId !== productId
        );
        if (quantity > 0) {
            updatedProducts.push({
                productId,
                quantity,
                price:
                    inventory?.data.find((item) => item.id === productId)
                        ?.price || 0,
            });
        }
        setSelectedProducts(updatedProducts);
    };

    const totalAmount = selectedProducts.reduce(
        (sum, p) => sum + p.quantity * p.price,
        0
    );

    const handleSubmit = form.handleSubmit((data) => {
        console.log("isDebtOrder", isDebtOrder);
        const payload = {
            ...data,
            orderItems: selectedProducts,
            totalAmount,
            debt: isDebtOrder,
            shipping: needsLoadingService,
        };
        console.log("payload", payload);
        createOrder(payload, {
            onSuccess: () => {
                toast({
                    title: ToastTitle.success,
                    description: "Tạo đơn hàng thành công",
                });
                onClose?.();
                queryClient.invalidateQueries({ queryKey: ["orders"] });
                router.push("/dashboard/orders");
            },
            onError: () => {
                toast({
                    title: ToastTitle.error,
                    description: "Tạo đơn hàng thất bại",
                });
                router.push("/dashboard/orders");
            },
        });
    });

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2 mb-4">
                    <FormField
                        control={form.control}
                        name="partnerId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chọn khách hàng</FormLabel>
                                <FormControl>
                                    <select {...field} className="input">
                                        <option value="">
                                            Chọn khách hàng
                                        </option>
                                        {partners?.data.map((partner) => (
                                            <option
                                                key={partner.id}
                                                value={partner.id}
                                            >
                                                {partner.name} - {partner.phone}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="mt-4">
                        <h3 className="font-semibold">Chọn sản phẩm:</h3>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">
                                        Tên sản phẩm
                                    </th>
                                    <th className="border border-gray-300 p-2">
                                        Số lượng muốn đặt
                                    </th>
                                    <th className="border border-gray-300 p-2">
                                        Giá
                                    </th>
                                    <th className="border border-gray-300 p-2">
                                        Sản phẩm trong kho
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory?.data.map((product) => (
                                    <tr key={product.id}>
                                        <td className="border border-gray-300 p-2">
                                            {product.productName}
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                max={product.quantity}
                                                placeholder="Số lượng"
                                                defaultValue={0}
                                                onChange={(e) =>
                                                    handleProductChange(
                                                        product.id,
                                                        Number(e.target.value),
                                                        product.quantity
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {product?.price.toLocaleString()}{" "}
                                            VND
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {product.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 font-bold">
                        Tổng tiền: {totalAmount.toLocaleString()} VND
                    </div>
                    <div className="mt-4">
                        Ấn vào đây để chuyển sang{" "}
                        {isDebtOrder ? "Hóa đơn thường" : "Hóa đơn nợ"}
                        <br />
                        Loại Hóa Đơn :
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDebtOrder((prev) => !prev)}
                        >
                            {isDebtOrder ? "Hóa đơn nợ" : "Hóa đơn thường"}
                        </Button>
                    </div>
                    <div className="mt-4">
                        <h3>Bạn có muốn thuê bốc vác không?</h3>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setNeedsLoadingService((prev) => !prev)
                            }
                        >
                            {needsLoadingService
                                ? "Có thuê bốc vác"
                                : "Không thuê bốc vác"}
                        </Button>
                    </div>

                    <DialogFooter className="mt-2">
                        <Button
                            type="submit"
                            disabled={!selectedProducts.length}
                        >
                            Tạo đơn hàng
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => router.push("/dashboard/orders")}
                        >
                            Hủy
                        </Button>
                    </DialogFooter>
                </div>
            </form>
        </Form>
    );
};

export default OrderForm;
