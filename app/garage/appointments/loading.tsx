import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AppointmentsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto max-w-6xl p-4 space-y-6">
        {/* Page Header Skeleton */}
        <Card className="border-blue-100">
          <CardContent className="p-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardContent>
        </Card>

        {/* Stats Cards Skeleton */}
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <Card className="border-blue-100">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Appointments List Skeleton */}
        <Card className="border-blue-100">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-16 w-full rounded-md" />
                    </div>
                    <div className="flex flex-col space-y-2 lg:ml-6">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
