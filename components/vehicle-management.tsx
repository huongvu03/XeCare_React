"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Car, Edit, Trash2, Plus, Eye, Search, Loader2, Wrench } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import axiosClient from "@/lib/axiosClient"

import {Vehicle,VehicleType, Category, UserVehicleTypeCreateDto, UserVehicleTypeUpdateDto } from "@/types/users/userVehicle";
import { VehicleApi } from "@/lib/api/userVehicleApi";
import VehicleForm from "@/components/vehicles/VehicleForm";
import VehicleCard from "@/components/vehicles/VehicleCard";
import VehicleDetailView from "@/components/vehicles/VehicleDetailView";
import { VehicleServiceHistory } from "@/components/vehicles/VehicleServiceHistory";

interface ApiResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}


export function VehicleManagement(
) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  
  // Debug vehicleTypes state changes
  useEffect(() => {
    console.log('🔍 [VehicleManagement] vehicleTypes state changed:', vehicleTypes);
  }, [vehicleTypes]);
  const [submitting, setSubmitting] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize] = useState(10)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false)
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null)
  const [lockingVehicle, setLockingVehicle] = useState<Vehicle | null>(null)
  const [lockReason, setLockReason] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    vehicleName: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "",
    color: "",
    categoryId: "0", // Updated default value to be a non-empty string
    vehicleTypeId: "0", // Updated default value to be a non-empty string
  })

  // Filter and sort states
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterByCategory, setFilterByCategory] = useState<string>("all")
  const [showLocked, setShowLocked] = useState<"all" | "active" | "locked">("active")

  const { user } = useAuth()
  const { toast } = useToast()

  // Fetch vehicles with pagination and search
  const fetchVehicles = async (
  page = 0,
  keyword = "",
  sortBy = "createdAt",
  direction = "desc",
  categoryId?: string,
  locked?: string
) => {
  try {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
      sortBy,
      direction,
    });

    if (keyword.trim()) params.append("keyword", keyword.trim());
    if (categoryId && categoryId !== "all") params.append("categoryId", categoryId);
    if (locked && locked !== "all") params.append("locked", locked);

const res = await axiosClient.get<ApiResponse<Vehicle>>(`/apis/user/vehicles?${params}`);
const response = res.data;
    setVehicles(response.content || []);
    setTotalPages(response.totalPages || 0);
    setTotalElements(response.totalElements || 0);
    setCurrentPage(response.number || 0);
    console.log("Fetched vehicles:", response);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    setVehicles([]);
  } finally {
    setLoading(false);
  }
};


  // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/apis/v1/vehicle/categories")
        setCategories(response.data || [])
        console.log("Fetched categories:", response);
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Cannot load vehicle categories.",
          variant: "destructive",
        })
      }
    }
    const fetchTypes = async () => {
      try {
        console.log("🔍 [fetchTypes] Starting to fetch vehicle types...");
        const response = await axiosClient.get("/apis/v1/vehicle")
        console.log("🔍 [fetchTypes] API response:", response);
        console.log("🔍 [fetchTypes] Response data:", response.data);
        setVehicleTypes(response.data || [])
        console.log("✅ [fetchTypes] Vehicle types set successfully:", response.data?.length || 0, "types");
      } catch (error) {
        console.error("❌ [fetchTypes] Error fetching vehicle types:", error)
        toast({
          title: "Error",
          description: "Cannot load vehicle types.",
          variant: "destructive",
        })
      }
    }

  // Initial data load
  useEffect(() => {
    if (user) {
      fetchVehicles()
      fetchCategories()
      fetchTypes()
    }
  }, [user])

  // Handle search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (user) {
        fetchVehicles(0, searchTerm, sortBy, sortDirection)
        setCurrentPage(0)
      }
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, sortBy, sortDirection, user])

  const resetForm = () => {
    setFormData({
      vehicleName: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      color: "",
      categoryId: "0", // Updated default value to be a non-empty string
      vehicleTypeId: "0", // Updated default value to be a non-empty string
    })
  }
  const handleConfirmLock = async () => {
    if (!lockingVehicle || !lockReason.trim()) {
      toast({
        title: "Error",
        description: "Please enter lock reason",
        variant: "destructive",
      })
      return
    }

    try {
      await axiosClient.post(`/apis/user/vehicles/${lockingVehicle.id}/lock?reason=${encodeURIComponent(lockReason)}`)

      setIsLockDialogOpen(false)
      setLockingVehicle(null)
      setLockReason("")
      fetchVehicles(currentPage, searchTerm, sortBy, sortDirection)
      toast({
        title: "Success",
        description: "Vehicle locked successfully",
      })
    } catch (error) {
      console.error("Error locking vehicle:", error)
      toast({
        title: "Error",
        description: "Cannot lock vehicle. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchVehicles(newPage, searchTerm, sortBy, sortDirection)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setActiveCategory("all")
    setFilterByCategory("all")
    setShowLocked("all")
    setSortBy("createdAt")
    setSortDirection("desc")
    setCurrentPage(0)
    fetchVehicles(0, "", "createdAt", "desc")
    toast({
      title: "Filters cleared",
      description: "Showing all vehicles",
    })
  }

  const getFilteredVehicles = () => {
    let filtered = vehicles

    // Filter by category
    if (filterByCategory !== "all") {
      if (filterByCategory === "uncategorized") {
        filtered = filtered.filter((v) => !v.categoryId)
      } else {
        filtered = filtered.filter((v) => v.categoryId?.toString() === filterByCategory)
      }
    }

    // Filter by locked status
    if (showLocked === "active") {
      filtered = filtered.filter((v) => !v.locked)
    } else if (showLocked === "locked") {
      filtered = filtered.filter((v) => v.locked)
    }

    return filtered
  }

  const getCategoryById = (id: number) => {
    return categories.find((c) => c.id === id)
  }

  const filteredVehicles = getFilteredVehicles()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-slate-600">Loading vehicle data...</span>
      </div>
    )
  }

// 📌 Tạo mới
  const handleCreate = async (dto: UserVehicleTypeCreateDto) => {
    await VehicleApi.create(dto);
    setIsAddDialogOpen(false);
    fetchVehicles();
  };

  // 📌 Cập nhật
  const handleUpdate = async (id: number, dto: UserVehicleTypeUpdateDto) => {
    try {
      console.log('🔍 [handleUpdate] Starting update:', { id, dto });
      console.log('🔍 [handleUpdate] User:', user);
      const token = localStorage.getItem('token');
      console.log('🔍 [handleUpdate] Token exists:', !!token);
      console.log('🔍 [handleUpdate] Token preview:', token ? token.substring(0, 50) + '...' : 'No token');
      console.log('🔍 [handleUpdate] User role:', user?.role);
      
      await VehicleApi.update(id, dto);
      setIsEditDialogOpen(false);
      setEditingVehicle(null);
      fetchVehicles();
      
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });
    } catch (error: any) {
      console.error('❌ [handleUpdate] Error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Cannot update vehicle. Please try again.",
        variant: "destructive",
      });
    }
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
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search vehicles by name, brand, model, license plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add New Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
              </DialogHeader>
              <VehicleForm
            initialData={editingVehicle || undefined}
            onSubmit={(dto) => handleCreate(dto)
            }
            onCancel={() => {
              setIsAddDialogOpen(false);
              setEditingVehicle(null);
            }}
            categories={categories}
            vehicleTypes={vehicleTypes}
          />
            </DialogContent>
          </Dialog>
        </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Creation Date</SelectItem>
                <SelectItem value="vehicleName">Vehicle Name</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="year">Year of Manufacture</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              className="h-10 px-3"
              title={`Sort ${sortDirection === "asc" ? "ascending" : "descending"}`}
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </Button>

            <Select value={filterByCategory} onValueChange={setFilterByCategory}>
              <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="uncategorized">Uncategorized</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={showLocked} onValueChange={(value: any) => setShowLocked(value)}>
              <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Active Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="active">
                  <div className="flex items-center space-x-2">
                    <span>🔓</span>
                    <span>Active Vehicles</span>
                  </div>
                </SelectItem>
                <SelectItem value="locked">
                  <div className="flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Locked Vehicles</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="h-10 px-4 text-slate-600 hover:text-slate-900 bg-transparent"
              title="Clear all filters"
            >
              <span className="mr-2">🔄</span>
              Show All
            </Button>
          </div>
      </div>

      {/* Statistics */}
      <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
        <div className="flex items-center space-x-6 flex-wrap">
          <span>
            Total: <strong className="text-slate-900">{totalElements}</strong> vehicles
          </span>
          <span>
            Displaying: <strong className="text-slate-900">{filteredVehicles.length}</strong> vehicles
          </span>
          <span>
            Active: <strong className="text-green-700">{vehicles.filter((v) => !v.locked).length}</strong> vehicles
          </span>
          <span>
            Locked: <strong className="text-red-700">{vehicles.filter((v) => v.locked).length}</strong> vehicles
          </span>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="space-y-4">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? "No vehicles found" : "No vehicles yet"}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm
                ? "Try changing search keywords or filters"
                : "Add your first vehicle to start managing your vehicles"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Vehicle
              </Button>
            )}
          </div>
        ) : (
          Array.isArray(vehicles) && vehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={() => {
          setEditingVehicle(vehicle);
          setIsEditDialogOpen(true);
        }}
        onDelete={() => handleDelete(vehicle.id)}
        onLock={(id, reason) => handleLock(vehicle.id, reason)}
        onUnlock={() => handleUnlock(vehicle.id)}
        onViewDetail={() => {
          setSelectedVehicle(vehicle);
          setIsViewDialogOpen(true);
        }}
      />
    ))
  ) : (
    <p className="text-gray-500">No vehicles available</p>
  )
)}
      </div>

      {/* Service History Section - Show summary for all vehicles */}
      {vehicles.length > 0 && (
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span>Vehicle Service History Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-slate-600 mb-4">
                To view detailed service history for each vehicle, click the 📋 (History) icon on the corresponding vehicle.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">Total Vehicles</p>
                  <p className="text-2xl font-bold text-blue-600">{vehicles.length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">Active Vehicles</p>
                  <p className="text-2xl font-bold text-green-600">{vehicles.filter(v => !v.locked).length}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="font-medium text-orange-900">Locked Vehicles</p>
                  <p className="text-2xl font-bold text-orange-600">{vehicles.filter(v => v.locked).length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Page {currentPage + 1} / {totalPages} (Total {totalElements} vehicles)
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Vehicle Information</DialogTitle>
          </DialogHeader>
          <VehicleForm
            initialData={editingVehicle || undefined}
            onSubmit={(dto) =>
              editingVehicle ? handleUpdate(editingVehicle.id, dto) : handleCreate(dto)
            }
            onCancel={() => {
              setIsEditDialogOpen(false);
              setEditingVehicle(null);
            }}
            categories={categories}
            vehicleTypes={vehicleTypes}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
          </DialogHeader>
          {selectedVehicle && <VehicleDetailView vehicle={selectedVehicle} open={isDetailOpen} onClose={() => setIsDetailOpen(false)} />}
        </DialogContent>
      </Dialog>

      {/* Lock Dialog */}
      <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Lock Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Are you sure you want to lock vehicle <strong>{lockingVehicle?.vehicleName}</strong>?
            </p>
            <div className="space-y-2">
              <Label htmlFor="lockReason">Lock Reason *</Label>
              <Input
                id="lockReason"
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                placeholder="Enter lock reason..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsLockDialogOpen(false)
                  setLockingVehicle(null)
                  setLockReason("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmLock}
                disabled={!lockReason.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Lock Vehicle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
