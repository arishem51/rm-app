'use client';

import useAppQuery from "@/hooks/use-app-query";
import { ApiQuery } from "@/services/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


type Props = {
  id: number;
};

const PaymentDetail = ({ id }: Props) => {
  const { data } = useAppQuery(ApiQuery.payment.getPayment(Number(id)));
  const router = useRouter();

  if (!data) return <div>Loading...</div>;

  const payment = data.data;

  return (
    <div className="container mx-auto p-6">
      <Button onClick={() => router.back()} className="mb-4">Quay lại</Button>
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>ID:</strong> {payment.id}</p>
              <p><strong>Tên đối tác:</strong> {payment.partnerName}</p>
              <p><strong>Số điện thoại:</strong> {payment.partnerPhone}</p>
            </div>
            <div>
              <p><strong>Tiền hàng:</strong> {payment.orderAmount?.toLocaleString()} VND</p>
              <p><strong>Giảm giá:</strong> {payment.discount?.toLocaleString()} VND</p>
              <p><strong>Phí vận chuyển:</strong> {payment.shippingFee?.toLocaleString()} VND</p>
              <p><strong>Tổng tiền:</strong> {payment.totalAmount?.toLocaleString()} VND</p>
              <p><strong>Trạng thái nợ:</strong> {payment.debt ? 'Có nợ' : 'Không nợ'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Sản phẩm</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tổng giá sản phẩm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payment.orderItems.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.productId}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price?.toLocaleString()} VND</TableCell>
                  <TableCell>{(item?.quantity * item?.price)?.toLocaleString()} VND</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDetail;
