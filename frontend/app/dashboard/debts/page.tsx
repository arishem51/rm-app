"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthAtomValue } from '@/store/auth';
import {
  Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Typography, MenuItem, Select, InputLabel, FormControl,
  Dialog, DialogActions, DialogContent, DialogTitle, Snackbar
} from '@mui/material';
import { set } from 'lodash';

export interface DebtNote {
  id: number;
  totalAmount: number;
  status: string;
  source: string;
  description: string;
  createdAt: string;
  partnerName: string;
  partnerAddress: string;
  partnerPhone: string;
}

export interface DebtDetail {
  id: number;
  amount: number;
  isPlus: boolean;
  description: string;
  createdAt: string;
  debtNoteId: number;
}

export interface CreateDebtNoteDTO {
  partnerId: number;
  totalAmount: number;
  status: string;
  source: string;
  description: string;
}

export interface CreateDebtDetailDTO {
  debtNoteId: number;
  amount: number;
  dueDate: string;
  isPlus: boolean;
  description: string;
}

export interface Partner {
  id: number;
  name: string;
}

export default function DebtsPage() {
  const [debtNotes, setDebtNotes] = useState<DebtNote[]>([]);
  const [debtDetails, setDebtDetails] = useState<DebtDetail[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    partnerId: '',
    minTotalAmount: '',
    maxTotalAmount: '',
    fromDate: '',
    toDate: '',
    createdBy: ''
  });
  const [page, setPage] = useState(0);  // Trang hiện tại
  const [pageSize, setPageSize] = useState(10);  // Số lượng mục mỗi trang
  const [totalElements, setTotalElements] = useState(0);  // Tổng số mục
  const [totalPages, setTotalPages] = useState(0); 
  const [selectedDebtNoteId, setSelectedDebtNoteId] = useState<number | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openCreateDebtNoteDialog, setOpenCreateDebtNoteDialog] = useState(false);
  const [openCreateDebtDetailDialog, setOpenCreateDebtDetailDialog] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);  // State to hold the message


  const [newDebtNote, setNewDebtNote] = useState<CreateDebtNoteDTO>({
    partnerId: 0,
    totalAmount: 0,
    status: 'PENDING',
    source: '',
    description: ''
  });

  const [newDebtDetail, setNewDebtDetail] = useState<CreateDebtDetailDTO>({
    debtNoteId: 0,
    amount: 0,
    dueDate: '',
    description: '',
    isPlus: true  
  });

  const token = useAuthAtomValue().token;

  useEffect(() => {
    fetchDebtNotes(page, pageSize, filter);
    fetchPartners();
  }, [page, pageSize, filter]);

  const fetchDebtNotes = async (page: number, pageSize: number, filter: any) => {
    setLoading(true);
    try {
      const params = {
        ...filter,
        page,
        size: pageSize,
      };
      const response = await axios.get('http://localhost:8080/api/debts', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDebtNotes(response.data.data);
      setTotalElements(response.data.data);
    } catch (error) {
      console.error('Error fetching debt notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/partners', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPartners(response.data.data.data); // Set the partners list
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };
  const fetchDebtDetails = async (debtNoteId: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/debt-details/debt-note/${debtNoteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const debtDetailsData = response.data.data.content;
      setDebtDetails(debtDetailsData);

      // Calculate totalAmount (sum of orderAmount - paidAmount)
      const totalAmount = debtDetailsData.reduce((acc, debtDetail) => {
        return acc + (debtDetail.orderAmount - debtDetail.paidAmount);
      }, 0);
      setTotalAmount(totalAmount);

      setOpenDetailsDialog(true);
    } catch (error) {
      console.error('Error fetching debt details:', error);
    }
  };

  const handleCreateDebtNote = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/debts', newDebtNote, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Thêm người nợ thành công!'); // Set the success message
      console.log('DebtNote created:', response.data);
      setOpenCreateDebtNoteDialog(false);
      setNewDebtNote({
        partnerId: 0,
        totalAmount: 0,
        status: 'PENDING',
        source: '',
        description: ''
      });
      // Optionally, you can re-fetch debt notes after creating the debt note
    } catch (error: any) {
      console.error('Error creating debt note:', error);
      setMessage(error.response.data.message); // Set the error message')
    }
  };

  const handleCreateDebtDetail = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/debt-details', newDebtDetail, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('DebtDetail created successfully!');
      console.log('DebtDetail created:', response.data);
      setOpenCreateDebtDetailDialog(false);
      setNewDebtDetail({
        debtNoteId: 0,
        dueDate: '',
        amount: 0,
        description: '',
        isPlus: true
      });
      // Optionally, you can re-fetch debt details after creating the debt detail
    } catch (error) {
      console.error('Error creating debt detail:', error);
    }
  };

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilter(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePageChange = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (e: any) => {
    setPageSize(e.target.value);
  };

  const handleViewDetails = (debtNoteId: number) => {
    setSelectedDebtNoteId(debtNoteId);
    fetchDebtDetails(debtNoteId);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };

  const handleOpenCreateDebtNoteDialog = () => {
    setOpenCreateDebtNoteDialog(true);
  };

  const handleCloseCreateDebtNoteDialog = () => {
    setOpenCreateDebtNoteDialog(false);
  };

  const handleOpenCreateDebtDetailDialog = (debtDetailId: number, action: string | null) => {
    const selectedDebtDetail = debtDetails.find(detail => detail.id === debtDetailId);
  
    if (selectedDebtDetail && action !== null) {
      // Lấy `debtNoteId` từ `debtDetail`
      const newDebtDetail1 = {
        ...newDebtDetail,
        debtNoteId: selectedDebtDetail.debtNoteId,  // Truyền đúng `debtNoteId`
        amount: selectedDebtDetail.amount,  // Sử dụng amount của debtDetail
        isPlus: action === 'Plus',  // Xác định isPlus dựa trên action
        description: `Thanh toán cho đơn ${selectedDebtDetail.id}`  // Cập nhật mô tả
      };
  
      setNewDebtDetail(newDebtDetail1);
      setOpenCreateDebtDetailDialog(true); // Mở dialog
    } else {
      const newDebtDetail1 = {
        ...newDebtDetail,
        debtNoteId: debtDetailId,  // Không có debtNoteId, có thể để 0 hoặc để trống
        amount: 0,  // Amount mặc định là 0
        isPlus: true,  // Hoặc để true nếu bạn muốn mặc định hành động là "Plus"
        description: 'Tạo phiếu nợ cho đơn mới'  // Mô tả mặc định cho hành động không có
      };
  
      setNewDebtDetail(newDebtDetail1);
      setOpenCreateDebtDetailDialog(true);
    }
  };
  

  const handleCloseCreateDebtDetailDialog = () => {
    setOpenCreateDebtDetailDialog(false);
  };

  const handleChangeCreateDebtNote = (e: any) => {
    const { name, value } = e.target;
    setNewDebtNote(prevState => ({ ...prevState, [name]: value }));
  };

  const handleChangeCreateDebtDetail = (e: any) => {
    const { name, value } = e.target;
    setNewDebtDetail(prevState => ({ ...prevState, [name]: value }));
  };

  return (
      <div className="px-4">
        <h1 className="text-3xl font-bold mt-2" >Quản lý công nợ</h1>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <TextField label="ID" name="partnerId" value={filter.partnerId} onChange={handleFilterChange} />
          <TextField label="Số tiền tối thiểu" name="minTotalAmount" type="number" value={filter.minTotalAmount} onChange={handleFilterChange} />
          <TextField label="Số tiền tối đa" name="maxTotalAmount" type="number" value={filter.maxTotalAmount} onChange={handleFilterChange} />
          <TextField label="Từ ngày" name="fromDate" type="date" value={filter.fromDate} onChange={handleFilterChange} />
          <TextField label="Đến ngày" name="toDate" type="date" value={filter.toDate} onChange={handleFilterChange} />
      
          <Button className="flex mb-6 gap-4 bg-black-500" style={{backgroundColor:'black'}} onClick={() => fetchDebtNotes(0, pageSize, filter)} variant="contained">Filter</Button>
        </div>
        <Button onClick={handleOpenCreateDebtNoteDialog} variant="contained" style={{ marginTop: '20px', backgroundColor:'black' }}>
          Thêm người nợ
        </Button>
         {/* Snackbar for showing messages */}
      <Snackbar
        open={message !== null}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        message={message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
        {/* Debt Notes Table */}
        {loading ? <div>Loading...</div> : (
            <Table className="min-w-full table-auto shadow-lg rounded-lg">
            <TableHead>
              <TableRow className="bg-black-500 text-white">
                <TableCell>ID</TableCell>
                <TableCell>Tên khách hàng</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Tổng nợ</TableCell>
              
                <TableCell>Ngày tạo</TableCell>
                
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {debtNotes.map((debtNote) => (
                <TableRow key={debtNote.id} className="border-b" 
                  style={{ backgroundColor: debtNote.totalAmount < 0 ? 'lightcoral' : 'white' }}>
                  <TableCell>{debtNote.id}</TableCell>
                  <TableCell>{debtNote.partnerName}</TableCell>
                  <TableCell>{debtNote.partnerAddress}</TableCell>
                  <TableCell>{debtNote.partnerPhone}</TableCell>
                  <TableCell>{debtNote.totalAmount}</TableCell>
                  
                  <TableCell>{new Date(debtNote.createdAt).toLocaleDateString()}</TableCell>
                
                  <TableCell>
                    <Button
                      style={{ backgroundColor: 'black', color: 'white' }}
                      onClick={() => handleViewDetails(debtNote.id)}
                      className="mr-2"
                    >
                      Chi Tiết
                    </Button>
                    <Button
                      style={{ backgroundColor: 'black', color: 'white' }}
                      onClick={() => handleOpenCreateDebtDetailDialog(debtNote.id, null)}
                    >
                      Tạo Phiếu Nợ
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Create Debt Note Button */}
        
        {/* Pagination */}
      {/* Pagination */}
      
      
        {/* Debt Details Dialog */}
        <Dialog 
  open={openDetailsDialog} 
  onClose={handleCloseDetailsDialog} 
  className="overflow-hidden rounded-lg shadow-xl"
  maxWidth="md" // Điều chỉnh kích thước dialog, "md" sẽ giúp dialog rộng vừa phải
  fullWidth={false} // Không dùng fullWidth, giữ chiều rộng tùy chỉnh
>
  <DialogTitle className="text-xl font-semibold p-4 ">
    Chi Tiết
  </DialogTitle>
  <DialogContent className="p-4 bg-white">
    {/* Debt Details Table */}
    <Table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <TableHead>
        <TableRow className="text-white">
          <TableCell className="py-2 px-4">ID</TableCell>
          <TableCell className="py-2 px-4">Số tiền</TableCell>
          <TableCell className="py-2 px-4">Loại nợ</TableCell>
          <TableCell className="py-2 px-4">Mô tả</TableCell>
          <TableCell className="py-2 px-4">Ngày lập phiếu</TableCell>
          <TableCell className="py-2 px-4">Hành động</TableCell> {/* New column for action buttons */}
        </TableRow>
      </TableHead>
      <TableBody>
        {debtDetails.map((debtDetail) => (
          <TableRow 
            key={debtDetail.id} 
            className="hover:bg-gray-100"
            style={{ backgroundColor: debtDetail.isPlus ? 'white' : 'lightcoral' }}  // Apply color red if amount < 0
          >
            <TableCell className="py-2 px-4">{debtDetail.id}</TableCell>
            <TableCell className="py-2 px-4">{debtDetail.amount}</TableCell>
            <TableCell className="py-2 px-4">{debtDetail.isPlus ? 'CỘNG +' : 'TRỪ -'}</TableCell>
            <TableCell className="py-2 px-4">{debtDetail.description}</TableCell>
            <TableCell className="py-2 px-4">{debtDetail.createdAt}</TableCell>
            <TableCell className="py-2 px-4">
              <div className="flex gap-2"> {/* Flexbox for horizontal layout of buttons */}
                {/* Nút Minus chỉ được bấm khi isPlus là false */}
                <Button
  onClick={() => handleOpenCreateDebtDetailDialog(debtDetail.id, 'Minus')}
  disabled={!debtDetail.isPlus} // Nếu isPlus là true, thì nút Minus bị disable
  style={{
    backgroundColor: !debtDetail.isPlus ? 'lightcoral' : 'red', // Màu nhạt khi disable
    color: 'white',
    cursor: !debtDetail.isPlus ? 'not-allowed' : 'pointer'  // Thêm con trỏ chuột cho disabled
  }}
>
  Trừ -
</Button>

{/* Nút Plus chỉ được bấm khi isPlus là true */}
<Button
  onClick={() => handleOpenCreateDebtDetailDialog(debtDetail.id, 'Plus')}
  disabled={debtDetail.isPlus} // Nếu isPlus là false, thì nút Plus bị disable
  style={{
    backgroundColor: debtDetail.isPlus ? 'lightgreen' : 'green', // Màu nhạt khi disable
    color: 'white',
    cursor: debtDetail.isPlus ? 'not-allowed' : 'pointer'  // Thêm con trỏ chuột cho disabled
  }}
>
  Cộng +
</Button>

              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </DialogContent>
  <DialogActions className="p-4 bg-gray-100">
    <Button
      onClick={handleCloseDetailsDialog}
      color="primary"
      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
    >
      Đóng
    </Button>
  </DialogActions>
</Dialog>



        {/* Create Debt Note Dialog */}
<Dialog open={openCreateDebtNoteDialog} onClose={handleCloseCreateDebtNoteDialog} className="overflow-hidden rounded-lg shadow-xl">
  <DialogTitle className="text-xl font-bold text-gray-700 bg-blue-100 p-4 border-b-2 border-blue-500">
    Thêm Người Nợ
  </DialogTitle>
  <DialogContent className="p-4 bg-white">
    <FormControl fullWidth className="mb-4">
      <InputLabel>Tên Khách Hàng</InputLabel>
      <Select
        label="Partner"
        name="partnerId"
        value={newDebtNote.partnerId}
        onChange={handleChangeCreateDebtNote}
        className="border border-gray-300 rounded-md p-2"
      >
        {partners.map((partner) => (
          <MenuItem key={partner.id} value={partner.id}>
            {partner.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <TextField
      label="Số tiền"
      name="totalAmount"
      type="number"
      value={newDebtNote.totalAmount}
      onChange={handleChangeCreateDebtNote}
      fullWidth
      className="mb-4"
      variant="outlined"
      inputProps={{
        readOnly: true,
        className: "p-2 border border-gray-300 rounded-md"
      }}
    />

    
    
    

    
  </DialogContent>

  <DialogActions className="p-4 bg-gray-100">
    <Button
      onClick={handleCloseCreateDebtNoteDialog}
      color="primary"
      className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
    >
      Huỷ
    </Button>
    <Button
      onClick={handleCreateDebtNote}
      color="primary"
      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
    >
      Tạo
    </Button>
  </DialogActions>
</Dialog>



<Dialog open={openCreateDebtDetailDialog} onClose={handleCloseCreateDebtDetailDialog}>
  <DialogTitle className="text-xl font-bold p-4 border-b-2 ">
    Tạo Phiếu Nợ
  </DialogTitle>
  <DialogContent className="p-4 bg-white">
    <TextField
      label="Ngày tạo phiếu"
      name="dueDate"
      type="date"
      value={newDebtDetail.dueDate}
      onChange={handleChangeCreateDebtDetail}
      fullWidth
      className="mb-4"
      variant="outlined"
    />
    <TextField
      label="Số tiền"
      name="amount"
      type="number"
      value={newDebtDetail.amount}
      onChange={handleChangeCreateDebtDetail}
      fullWidth
      className="mb-4"
      variant="outlined"
      inputProps={{
        className: "p-2 border border-gray-300 rounded-md"
      }}
    />
    <FormControl component="fieldset" fullWidth className="mb-4">
      <InputLabel>Loại nợ</InputLabel>
      <Select
        label="Is Plus?"
        name="isPlus"
        value={newDebtDetail.isPlus}
        onChange={handleChangeCreateDebtDetail}
        className="border border-gray-300 rounded-md p-2"
      >
        <MenuItem value={true}>+ CỘNG</MenuItem>
        <MenuItem value={false}>- TRỪ</MenuItem>
      </Select>
    </FormControl>
    <TextField
      label="Miêu tả"
      name="description"
      value={newDebtDetail.description}
      onChange={handleChangeCreateDebtDetail}
      fullWidth
      className="mb-4"
      variant="outlined"
      inputProps={{
        className: "p-2 border border-gray-300 rounded-md"
      }}
    />
  </DialogContent>
  <DialogActions className="p-4 bg-gray-100">
    <Button
      onClick={handleCloseCreateDebtDetailDialog}
      color="primary"
      className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
    >
      Huỷ
    </Button>
    <Button
      onClick={handleCreateDebtDetail}
      color="primary"
      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
    >
      Tạo
    </Button>
  </DialogActions>
</Dialog>



      </div>
  );
}
