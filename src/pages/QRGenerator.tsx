import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { qrData } from "@/data/mockQRData";
import { useNavigate } from "react-router-dom";
import { useAxios } from "@/hooks/useAxios";
import { createQR, getAllPrinters, listQR, listQRQuery } from "@/lib/api/methods";
import { Fingerprint } from "@/lib/api/types";

const QRGenerator = () => {
  const { data, isLoading: loadingQRs } = useAxios(listQR);
  const { data: printers, isLoading: loadingPrinters } = useAxios(getAllPrinters);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [qrCount, setQrCount] = useState<number>(0);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [status, setStatus] = useState("All");
  const [qrData, setQrData] = useState<Fingerprint[]>([]);
  const [totalQR, setTotalQR] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingQRs) {
      setQrData(data.results);
    }
  }, [data]);

  const handleGenerateQR = async () => {
    try {
      const response = await createQR({ count: qrCount, printer: parseInt(selectedPrinter) });
      alert(response.data.message ?? "Success");
    } catch (error) {
      alert(error);
    }
  };

  const handleFilters = async ({
    status,
    sort,
    search
  }: {
    status?: string;
    sort?: string;
    search?: string;
  } = {}) => {
    try {
      const response = await listQRQuery({
        search: search ?? searchTerm,
        sort: sort ?? sortBy,
        status: status ?? (status === "All" ? "" : status)
      });
      setQrData(response.results);
    } catch (error) {
      alert(error);
    }
  };

  if (loadingPrinters || loadingQRs) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        {/* Total QRs Generated */}

        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">
              Total QRs <br /> generated
            </div>
            <div className="flex items-center gap-1">
              <img src="/qricon.png" className="w-7 h-7" />
              <span className="text-2xl font-bold pb-1">11</span>
            </div>
          </CardContent>
        </Card>

        {/* Total QR Generation Limit */}

        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Total QR generation limit for your plan</div>
            <div className="flex items-center gap-1">
              <img src="/qricon.png" className="w-7 h-7" />
              <span className="text-2xl font-bold pb-1">19,000</span>
            </div>
          </CardContent>
        </Card>

        {/* Credit Balance */}

        <Card>
          <CardContent className="p-5">
            <div className="text-[13px] text-muted-foreground">
              Credit balance |{" "}
              <span className="text-green-600 cursor-pointer hover:underline" onClick={() => navigate("/plan-details")}>
                Buy credits
              </span>
            </div>
            <div className="text-xs text-muted-foreground">(1 credit = 1 QR generation)</div>
            <div className="flex items-center gap-1">
              <img src="/dollar.png" className="w-7 h-7" />
              <span className="text-2xl font-bold pb-1">1691</span>
            </div>
          </CardContent>
        </Card>

        {/* Generate QRs */}

        <Card className="col-span-2">
          <CardContent className="p-5">
            <div className="flex">
              <div className="w-1/2">
                <div className="text-sm text-muted-foreground mb-2">Enter the number of QRs you want to generate</div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={qrCount}
                      onChange={(e) => setQrCount(parseInt(e.target.value))}
                      placeholder="6"
                      className="flex-1 h-7"
                    />
                    <Select value={selectedPrinter} onValueChange={setSelectedPrinter}>
                      <SelectTrigger className="w-32 h-7">
                        <SelectValue placeholder="Select printer" />
                      </SelectTrigger>
                      <SelectContent>
                        {printers.results.length > 0 &&
                          printers.results.map((printer) => (
                            <SelectItem key={printer.id} value={printer.id.toString()}>
                              {printer.printer_name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="w-1/2 flex justify-end items-center">
                <Button className="bg-green-400 hover:bg-green-500 rounded-sm px-8 py-5" onClick={handleGenerateQR}>
                  Generate QRs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated QRs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <CardTitle className="text-lg font-semibold ">Generated QRs</CardTitle>
              {/* Search */}
              <div className="flex items-center relative">
                <div className="w-[300px]">
                  <Input
                    type="text"
                    placeholder="Search QR by Serial or Product Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10"
                  />
                </div>
                <button className="absolute right-0 h-9 w-10 flex rounded-r-md justify-center items-center bg-gray-300">
                  <Search className="h-4 w-4 text-muted-foreground" onClick={() => handleFilters()} />
                </button>
              </div>
            </div>

            <div className="flex flex-row justify-end gap-4">
              {/* Sort and Status */}
              <div className="flex gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(val) => {
                    setSortBy(val);
                    handleFilters({ sort: val });
                  }}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Sort by: Latest first</SelectItem>
                    <SelectItem value="oldest">Sort by: Oldest first</SelectItem>
                    <SelectItem value="name-asc">Sort by: Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Sort by: Name Z-A</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={status}
                  onValueChange={(val) => {
                    setStatus(val);
                    handleFilters({ status: val === "All" ? "" : val });
                  }}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                    <SelectItem value="Compromised">Compromised</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-green-50">
                <TableHead className="pl-4">QR Serial No.</TableHead>
                <TableHead>Linked Product</TableHead>
                <TableHead>Linked Printer</TableHead>
                <TableHead>Date created</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qrData.length > 0 ? (
                qrData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium pl-5">#{item.serial_number}</TableCell>
                    <TableCell>{item.product_name ?? "-"}</TableCell>
                    <TableCell>{item.printer_name}</TableCell>
                    <TableCell>{item.created_at}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="text-green-600 hover:text-green-700 p-0 h-auto"
                        onClick={() => navigate(`/qr-generator/${item.id}`)}>
                        View details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No QR codes found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRGenerator;
