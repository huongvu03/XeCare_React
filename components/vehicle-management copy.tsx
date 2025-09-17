import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Vehicle, UserVehicleTypeCreateDto, UserVehicleTypeUpdateDto } from "@/types/users/userVehicle";
import { VehicleApi } from "@/lib/api/userVehicleApi";
import VehicleForm from "@/components/vehicles/VehicleForm";
import VehicleCard from "@/components/vehicles/VehicleCard";
import VehicleDetailView from "@/components/vehicles/VehicleDetailView";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [search, setSearch] = useState("");

  // 📌 Load danh sách
  const fetchVehicles = async () => {
    try {
      const res = await VehicleApi.getAll(search);
      // Kiểm tra dữ liệu trả về
      if (Array.isArray(res.data)) {
        setVehicles(res.data);
      } else if (Array.isArray(res.data.content)) {
        setVehicles(res.data.content);
      } else if (Array.isArray(res.data.vehicles)) {
        setVehicles(res.data.vehicles);
      } else {
        setVehicles([]); // fallback
      }
    } catch (error) {
      console.error("Lỗi khi load vehicles:", error);
      setVehicles([]);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [search]);

  // 📌 Tạo mới
  const handleCreate = async (dto: UserVehicleTypeCreateDto) => {
    await VehicleApi.create(dto);
    setIsFormOpen(false);
    fetchVehicles();
  };

  // 📌 Cập nhật
  const handleUpdate = async (id: number, dto: UserVehicleTypeUpdateDto) => {
    await VehicleApi.update(id, dto);
    setIsFormOpen(false);
    setEditingVehicle(null);
    fetchVehicles();
  };

  // 📌 Xóa
  const handleDelete = async (id: number) => {
    await VehicleApi.remove(id);
    fetchVehicles();
  };

  // 📌 Lock/Unlock
  const handleLock = async (id: number, reason: string) => {
    await VehicleApi.lock(id, reason);
    fetchVehicles();
  };

  const handleUnlock = async (id: number) => {
    await VehicleApi.unlock(id);
    fetchVehicles();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Tìm kiếm phương tiện..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsFormOpen(true)}>+ Thêm phương tiện</Button>
      </div>

      {/* Danh sách card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(vehicles) && vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={() => {
                setEditingVehicle(vehicle);
                setIsFormOpen(true);
              }}
              onDelete={() => handleDelete(vehicle.id)}
              onLock={(id, reason) => handleLock(vehicle.id, reason)}
              onUnlock={() => handleUnlock(vehicle.id)}
              onViewDetail={() => {
                setSelectedVehicle(vehicle);
                setIsDetailOpen(true);
              }}
            />
          ))
        ) : (
          <p className="text-gray-500">Không có phương tiện nào</p>
        )}
      </div>

      {/* Form thêm/sửa */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Sửa phương tiện" : "Thêm phương tiện"}</DialogTitle>
          </DialogHeader>
          <VehicleForm
            initialData={editingVehicle || undefined}
            onSubmit={(dto) =>
              editingVehicle ? handleUpdate(editingVehicle.id, dto) : handleCreate(dto)
            }
            onCancel={() => {
              setIsFormOpen(false);
              setEditingVehicle(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Xem chi tiết */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết phương tiện</DialogTitle>
          </DialogHeader>
          {selectedVehicle && <VehicleDetailView vehicle={selectedVehicle} open={isDetailOpen} onClose={() => setIsDetailOpen(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
