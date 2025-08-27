"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Edit, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import userVehicleApi from "@/lib/api/userVehicleApi"
import { UserVehicleTypeResponseDto } from "@/types/users/userVehicle"
import userVehicleCategoryApi, { UserVehicleTypeCategory } from "@/lib/api/userVehicleCategoryApi"

const lockReasons = ["Đã bán xe", "Xe hỏng nặng", "Không sử dụng tạm thời", "Chờ sửa chữa", "Lý do khác"]

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<UserVehicleTypeResponseDto[]>([])
  const [categories, setCategories] = useState<UserVehicleTypeCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
    // sort + filter
  const [sortBy, setSortBy] = useState("nameAsc")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false)

  const [editingVehicle, setEditingVehicle] = useState<UserVehicleTypeResponseDto | null>(null)
  const [viewingVehicle, setViewingVehicle] = useState<UserVehicleTypeResponseDto | null>(null)
  const [lockingVehicle, setLockingVehicle] = useState<UserVehicleTypeResponseDto | null>(null)
  const [lockReason, setLockReason] = useState("")

  const [formData, setFormData] = useState<any>({
    vehicleName: "",
    brand: "",
    model: "",
    color: "",
    licensePlate: "",
    year: new Date().getFullYear(),
    categoryId: 1,
    vehicleTypeId: 1,
  })

  const { toast } = useToast()

  // ---------------- Fetch ----------------
  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const data = await userVehicleApi.getAll()
      setVehicles(Array.isArray(data) ? data.map(v => ({ ...v, isLocked: Boolean(v.isLocked) })) : [])
    } catch {
      toast({ title: "Lỗi", description: "Không tải được danh sách xe", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await userVehicleCategoryApi.getAll()
      setCategories(res.data)
    } catch (err) {
      console.error("Không tải được categories", err)
    }
  }

  useEffect(() => {
    fetchVehicles()
    fetchCategories()
  }, [])

  // ---------------- Search + Sort + Filter ----------------
  const processedVehicles = vehicles
    .filter(v =>
      v.vehicleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(v => filterCategory === "all" || v.categoryId.toString() === filterCategory)
    .filter(v => {
      if (filterStatus === "locked") return v.isLocked
      if (filterStatus === "unlocked") return !v.isLocked
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "nameAsc": return a.vehicleName.localeCompare(b.vehicleName)
        case "nameDesc": return b.vehicleName.localeCompare(a.vehicleName)
        case "yearAsc": return a.year - b.year
        case "yearDesc": return b.year - a.year
        case "statusLocked": return (b.isLocked ? 1 : 0) - (a.isLocked ? 1 : 0)
        case "statusUnlocked": return (a.isLocked ? 1 : 0) - (b.isLocked ? 1 : 0)
        default: return 0
      }
    })

  // ---------------- Form + CRUD ----------------
  const resetForm = () => {
    setFormData({
      vehicleName: "",
      brand: "",
      model: "",
      color: "",
      licensePlate: "",
      year: new Date().getFullYear(),
      categoryId: categories[0]?.id || 1,
      vehicleTypeId: 1,
    })
  }

  // ---------------- CRUD ----------------
  const handleAdd = async () => {
    try {
      await userVehicleApi.create({
        vehicleName: formData.vehicleName,
        brand: formData.brand,
        model: formData.model,
        licensePlate: formData.licensePlate,
        year: formData.year,
        categoryId: formData.categoryId,
      })
      await fetchVehicles()
      setIsAddDialogOpen(false)
      resetForm()
      toast({ title: "Thành công", description: "Đã thêm xe mới" })
    } catch {
      toast({ title: "Lỗi", description: "Không thể thêm xe", variant: "destructive" })
    }
  }

  const handleUpdate = async () => {
    if (!editingVehicle) return
    try {
      await userVehicleApi.update(editingVehicle.id, {
        vehicleName: formData.vehicleName,
        brand: formData.brand,
        model: formData.model || null,
        color: formData.color || null,
        licensePlate: formData.licensePlate,
        year: formData.year,
        categoryId: formData.categoryId,
        vehicleTypeId: formData.vehicleTypeId,
      })
      await fetchVehicles()
      setIsEditDialogOpen(false)
      setEditingVehicle(null)
      resetForm()
      toast({ title: "Thành công", description: "Đã cập nhật xe" })
    } catch {
      toast({ title: "Lỗi", description: "Không thể cập nhật xe", variant: "destructive" })
    }
  }

  const handleConfirmLock = async () => {
    if (!lockingVehicle) return
    try {
      await userVehicleApi.lock(lockingVehicle.id, lockReason)
      await fetchVehicles()
      setIsLockDialogOpen(false)
      setLockingVehicle(null)
      setLockReason("")
      toast({ title: "Thành công", description: "Xe đã bị khóa" })
    } catch {
      toast({ title: "Lỗi", description: "Không thể khóa xe", variant: "destructive" })
    }
  }

  const handleUnlock = async (id: number) => {
    try {
      await userVehicleApi.unlock(id)
      await fetchVehicles()
      setLockingVehicle(null)
      toast({ title: "Thành công", description: "Xe đã được mở khóa" })
    } catch {
      toast({ title: "Lỗi", description: "Không thể mở khóa xe", variant: "destructive" })
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  // ---------------- UI ----------------
  const VehicleForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="grid gap-4">
      <Label>Tên xe</Label>
      <Input value={formData.vehicleName} onChange={e => handleChange("vehicleName", e.target.value)} placeholder="VD: Xe máy Honda" />

      <Label htmlFor="categoryId">Danh mục</Label>
      <Select value={formData.categoryId?.toString() || ""} onValueChange={value => handleChange("categoryId", Number(value))}>
        <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
        <SelectContent>
          {categories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Label>Hãng xe</Label>
      <Input value={formData.brand} onChange={e => handleChange("brand", e.target.value)} placeholder="VD: Honda" />

      <Label>Model</Label>
      <Input value={formData.model} onChange={e => handleChange("model", e.target.value)} placeholder="VD: Wave Alpha" />

      <Label>Màu sắc</Label>
      <Input value={formData.color} onChange={e => handleChange("color", e.target.value)} placeholder="VD: Đỏ" />

      <Label>Biển số</Label>
      <Input value={formData.licensePlate} onChange={e => handleChange("licensePlate", e.target.value)} placeholder="VD: 59H1-12345" />

      <Label>Năm SX</Label>
      <Input type="number" value={formData.year} onChange={e => handleChange("year", parseInt(e.target.value))} />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => (isEdit ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false))}>Hủy</Button>
        <Button onClick={isEdit ? handleUpdate : handleAdd}>{isEdit ? "Cập nhật" : "Thêm"}</Button>
      </div>
    </div>
  )

  const VehicleCard = ({ vehicle }: { vehicle: UserVehicleTypeResponseDto }) => {
    const isLocked = vehicle.isLocked
    const [confirmUnlockOpen, setConfirmUnlockOpen] = useState(false)

    return (
      <Card>
        <CardContent className="p-4 flex justify-between items-start">
          <div>
            <h3 className="font-bold">{vehicle.vehicleName}</h3>
            <p>{vehicle.brand} - {vehicle.model}</p>
            <p>Biển số: {vehicle.licensePlate}</p>
            <p>Năm SX: {vehicle.year}</p>
            {isLocked && <p className="text-red-500">🔒 {vehicle.lockReason}</p>}
          </div>

          <div className="flex gap-2">
            {/* View */}
            <Button size="sm" variant="outline" onClick={() => { setViewingVehicle(vehicle); setIsViewDialogOpen(true) }}>
              <Eye className="h-4 w-4" />
            </Button>

            {/* Edit */}
            {!isLocked && (
              <Button size="sm" variant="outline" onClick={() => {
                setEditingVehicle(vehicle)
                setFormData({
                  vehicleName: vehicle.vehicleName,
                  brand: vehicle.brand,
                  model: vehicle.model || "",
                  color: vehicle.color || "",
                  licensePlate: vehicle.licensePlate,
                  year: vehicle.year,
                  categoryId: vehicle.categoryId,
                  vehicleTypeId: vehicle.id || 1,
                })
                setIsEditDialogOpen(true)
              }}>
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {/* Lock / Unlock */}
            {!isLocked ? (
              <Button size="sm" variant="outline" onClick={() => { setLockingVehicle(vehicle); setIsLockDialogOpen(true) }}>🔒</Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => { setLockingVehicle(vehicle); setConfirmUnlockOpen(true) }}>🔓</Button>
            )}
          </div>
        </CardContent>

        {/* Confirm Unlock Dialog */}
        <Dialog open={confirmUnlockOpen} onOpenChange={setConfirmUnlockOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mở khóa xe</DialogTitle>
            </DialogHeader>
            <p>Bạn có chắc chắn muốn mở khóa xe này?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setConfirmUnlockOpen(false)}>Hủy</Button>
              <Button onClick={async () => { if (vehicle.id) await handleUnlock(vehicle.id); setConfirmUnlockOpen(false) }}>Xác nhận mở khóa</Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }

  // ---------------- Render ----------------
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Input
          placeholder="Tìm kiếm theo tên/biển số..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-1/2"
        />
{/* Sort */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sắp xếp" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="nameAsc">Tên A → Z</SelectItem>
            <SelectItem value="nameDesc">Tên Z → A</SelectItem>
            <SelectItem value="yearAsc">Năm SX ↑</SelectItem>
            <SelectItem value="yearDesc">Năm SX ↓</SelectItem>
            <SelectItem value="statusLocked">Đang khóa</SelectItem>
            <SelectItem value="statusUnlocked">Đang mở</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter by Category */}
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Danh mục" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map(cat => <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Filter by Status */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="locked">Đang khóa</SelectItem>
            <SelectItem value="unlocked">Đang mở</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Thêm xe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Thêm xe mới</DialogTitle></DialogHeader>
            <VehicleForm />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? <p>Đang tải...</p> :
        processedVehicles.length === 0 ? <p>Không tìm thấy xe nào</p> :
          processedVehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)
      }

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chỉnh sửa xe</DialogTitle></DialogHeader>
          <VehicleForm isEdit={true} />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chi tiết xe</DialogTitle></DialogHeader>
          {viewingVehicle && (
            <div>
              <p><b>Tên:</b> {viewingVehicle.vehicleName}</p>
              <p><b>Hãng:</b> {viewingVehicle.brand}</p>
              <p><b>Model:</b> {viewingVehicle.model}</p>
              <p><b>Biển số:</b> {viewingVehicle.licensePlate}</p>
              <p><b>Năm:</b> {viewingVehicle.year}</p>
              <p><b>Danh mục:</b> {viewingVehicle.categoryName}</p>
              <p><b>Loại xe:</b> {viewingVehicle.vehicleTypeName}</p>
              {viewingVehicle.isLocked && <p className="text-red-500">🔒 {viewingVehicle.lockReason}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lock Dialog */}
      <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Khóa xe</DialogTitle></DialogHeader>
          <Label>Lý do khóa</Label>
          <Select value={lockReason} onValueChange={setLockReason}>
            <SelectTrigger><SelectValue placeholder="Chọn lý do" /></SelectTrigger>
            <SelectContent>
              {lockReasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsLockDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleConfirmLock} disabled={!lockReason}>Xác nhận</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
