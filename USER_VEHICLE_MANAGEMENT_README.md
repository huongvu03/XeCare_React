# User Vehicle Management System

## Overview
The user vehicle management system allows logged-in users to manage their vehicles stored in the `user_vehicle_types` table. The system provides full CRUD operations and integrates with the booking system.

## Database Structure

### Table: `user_vehicle_types`
- `id` - Primary key
- `user_id` - Foreign key to Users table
- `vehicle_name` - Display name for the vehicle
- `brand` - Vehicle brand
- `model` - Vehicle model
- `color` - Vehicle color
- `license_plate` - Unique license plate
- `year` - Manufacturing year
- `category_id` - Foreign key to vehicle categories
- `vehicle_type_id` - Foreign key to vehicle types
- `locked` - Boolean flag for locked vehicles
- `lock_reason` - Reason for locking
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Backend Implementation

### API Endpoints
- `GET /apis/user/vehicles` - Get user's vehicles (paginated)
- `POST /apis/user/vehicles` - Create new vehicle
- `PUT /apis/user/vehicles/{id}` - Update vehicle
- `DELETE /apis/user/vehicles/{id}` - Delete vehicle
- `POST /apis/user/vehicles/{id}/lock` - Lock vehicle
- `POST /apis/user/vehicles/{id}/unlock` - Unlock vehicle
- `GET /apis/user/vehicles/categories` - Get vehicle categories

### Key Features
- **User Authentication**: All endpoints require valid JWT token
- **Data Filtering**: Vehicles are automatically filtered by logged-in user
- **Pagination**: Supports pagination with configurable page size
- **Search**: Full-text search by vehicle name, brand, model, license plate
- **Sorting**: Sort by creation date, vehicle name, brand, year
- **Locking**: Ability to lock/unlock vehicles with reason
- **Validation**: Comprehensive input validation

## Frontend Implementation

### Components
- `VehicleManagement` - Main vehicle management component
- `VehicleCard` - Individual vehicle display card
- `VehicleForm` - Form for creating/editing vehicles
- `VehicleDetailView` - Detailed vehicle information view

### Features
- **Dashboard Integration**: Displayed in user dashboard
- **Booking Integration**: Used in booking page to filter vehicles by garage vehicle types
- **Real-time Updates**: Automatic refresh after CRUD operations
- **Responsive Design**: Works on all device sizes
- **Search & Filter**: Advanced filtering by category, status, etc.

## Integration with Booking System

### Vehicle Selection Flow
1. User selects a vehicle type that garage supports
2. System filters user's vehicles to show only matching types
3. User selects specific vehicle from filtered list
4. Vehicle information is included in booking request

### Key Benefits
- **Accurate Bookings**: Only shows vehicles that garage can service
- **User Convenience**: Pre-populated vehicle information
- **Data Consistency**: Ensures vehicle type compatibility

## Usage Examples

### Adding a New Vehicle
```javascript
const newVehicle = {
  vehicleName: "My Honda Civic",
  brand: "Honda",
  model: "Civic",
  year: 2020,
  licensePlate: "30A-12345",
  color: "White",
  categoryId: 1,
  vehicleTypeId: 2
};

await VehicleApi.create(newVehicle);
```

### Filtering Vehicles by Type
```javascript
const filteredVehicles = userVehicles.filter(vehicle => 
  vehicle.vehicleTypeId === selectedVehicleType && !vehicle.locked
);
```

### Booking with Vehicle Selection
```javascript
const appointmentData = {
  garageId: garage.id,
  vehicleTypeId: selectedVehicleType,
  vehicleId: selectedVehicle, // Optional: specific vehicle ID
  appointmentDate: "2024-01-15",
  description: "Oil change",
  // ... other fields
};
```

## Security Features

### Authentication
- All API endpoints require valid JWT token
- User can only access their own vehicles
- Automatic user context from security context

### Data Validation
- Input sanitization and validation
- Unique license plate enforcement
- Required field validation
- Type checking for all fields

### Authorization
- Users can only CRUD their own vehicles
- Admin endpoints are protected
- Role-based access control

## Error Handling

### Backend
- Comprehensive exception handling
- Meaningful error messages
- Proper HTTP status codes
- Validation error responses

### Frontend
- User-friendly error messages
- Loading states and indicators
- Graceful fallbacks
- Toast notifications for feedback

## Performance Optimizations

### Backend
- Pagination for large datasets
- Database indexing on user_id
- Lazy loading of related entities
- Efficient queries with proper joins

### Frontend
- Debounced search
- Lazy loading of components
- Memoization of expensive operations
- Optimistic updates

## Testing

### Backend Tests
- Unit tests for service layer
- Integration tests for API endpoints
- Repository tests for data access
- Security tests for authentication

### Frontend Tests
- Component unit tests
- Integration tests for user flows
- E2E tests for critical paths
- Accessibility tests

## Future Enhancements

### Planned Features
- Vehicle image upload
- Maintenance history tracking
- Insurance information storage
- Service reminders
- Vehicle sharing between users
- Bulk operations
- Export/import functionality

### Technical Improvements
- Caching for better performance
- Real-time updates with WebSocket
- Offline support with PWA
- Advanced search with filters
- Data analytics and reporting

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Ensure valid JWT token
2. **Permission Denied**: Check user ownership of vehicle
3. **Validation Errors**: Verify all required fields
4. **Network Issues**: Check API connectivity
5. **Data Inconsistency**: Verify foreign key relationships

### Debug Steps
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check backend logs for exceptions
4. Validate database constraints
5. Test with different user accounts

## Support

For issues or questions regarding the user vehicle management system:
1. Check this documentation first
2. Review error logs and console output
3. Test with minimal data set
4. Contact development team with detailed error information
