import React, { useState, useEffect } from 'react';
import { Shield, Users, Settings, Save, AlertTriangle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { permissionService } from '@/services/permissionService';
import { Skeleton } from "@/components/ui/skeleton";
import { Role, Permission } from '@/types/permissions';

const AdminPermissions = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [localPermissions, setLocalPermissions] = useState<Record<number, number[]>>({});
  const [hasChanges, setHasChanges] = useState<Record<number, boolean>>({});

  // Fetch Roles
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: permissionService.getRoles
  });

  // Fetch Permissions
  const { data: permissions = [], isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionService.getPermissions
  });

  // Initialize local state when roles are loaded
  useEffect(() => {
    if (roles.length > 0) {
      const initialPermissions: Record<number, number[]> = {};
      roles.forEach(role => {
        initialPermissions[role.id] = role.permissions.map(p => p.id);
      });
      setLocalPermissions(initialPermissions);
    }
  }, [roles]);

  // Update Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, permissions }: { id: number; permissions: number[] }) =>
      permissionService.updateRole(id, { permissions }),
    onSuccess: (data, variables) => {
      toast({
        title: "Success",
        description: `Role ${data.name} updated successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setHasChanges(prev => ({ ...prev, [variables.id]: false }));
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      });
    }
  });

  const handleTogglePermission = (roleId: number, permissionId: number) => {
    setLocalPermissions(prev => {
      const currentRolePermissions = prev[roleId] || [];
      const hasPermission = currentRolePermissions.includes(permissionId);

      let newRolePermissions;
      if (hasPermission) {
        newRolePermissions = currentRolePermissions.filter(id => id !== permissionId);
      } else {
        newRolePermissions = [...currentRolePermissions, permissionId];
      }

      return {
        ...prev,
        [roleId]: newRolePermissions
      };
    });
    setHasChanges(prev => ({ ...prev, [roleId]: true }));
  };

  const handleSave = (roleId: number) => {
    updateRoleMutation.mutate({
      id: roleId,
      permissions: localPermissions[roleId]
    });
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    // Try to infer category from name (e.g., "news:create" -> "News")
    let category = 'Other';
    if (permission.name.includes(':')) {
      category = permission.name.split(':')[0];
      // Capitalize first letter
      category = category.charAt(0).toUpperCase() + category.slice(1);
    } else if (permission.slug.includes('-')) {
      // Fallback to slug if name doesn't have colon
      category = permission.slug.split('-')[0];
      category = category.charAt(0).toUpperCase() + category.slice(1);
    }

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const filteredCategories = Object.keys(groupedPermissions).filter(category => {
    const categoryPermissions = groupedPermissions[category];
    return categoryPermissions.some(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getRoleBadge = (roleSlug: string) => {
    switch (roleSlug) {
      case 'admin':
      case 'super-admin':
        return <Badge className="bg-primary text-primary-foreground">Admin</Badge>;
      case 'editor':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Editor</Badge>;
      case 'viewer':
      case 'user':
        return <Badge variant="outline">User</Badge>;
      default:
        return <Badge variant="outline">{roleSlug}</Badge>;
    }
  };

  if (isLoadingRoles || isLoadingPermissions) {
    return <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif">Permissions Management</h2>
          <p className="text-muted-foreground">Manage role-based access control.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Role Cards with Save Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {roles.map(role => (
          <Card key={role.id} className={hasChanges[role.id] ? "border-yellow-400 bg-yellow-50/30" : ""}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {role.slug === 'admin' && <Shield className="h-4 w-4" />}
                    {role.name}
                    {getRoleBadge(role.slug)}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    {role.description || 'No description'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-muted-foreground">Permissions:</span>
                <span className="font-medium">{localPermissions[role.id]?.length || 0}</span>
              </div>

              {hasChanges[role.id] && (
                <Button
                  size="sm"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => handleSave(role.id)}
                  disabled={updateRoleMutation.isPending}
                >
                  {updateRoleMutation.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Permission</TableHead>
                {roles.map(role => (
                  <TableHead key={role.id} className="text-center min-w-[100px]">
                    {role.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map(category => [
                // Category Header
                <TableRow key={`${category}-header`} className="bg-muted/50 hover:bg-muted/50">
                  <TableCell colSpan={roles.length + 1} className="font-semibold py-2">
                    {category} Management
                  </TableCell>
                </TableRow>,

                // Permissions in Category
                ...groupedPermissions[category]
                  .filter(p =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(permission => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div className="flex flex-col ">
                          <span className="font-medium text-sm">{permission.name}</span>
                          <span className="text-xs text-muted-foreground">{permission.description}</span>
                        </div>
                      </TableCell>
                      {roles.map(role => {
                        const isAdmin = role.slug === 'admin' || role.slug === 'super-admin';
                        const isChecked = isAdmin || (localPermissions[role.id]?.includes(permission.id) ?? false);

                        return (
                          <TableCell key={role.id} className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={isChecked}
                                disabled={isAdmin} // Lock admin permissions
                                onCheckedChange={() => handleTogglePermission(role.id, permission.id)}
                                className={isAdmin ? "data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-400 cursor-not-allowed opacity-50" : ""}
                              />
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              ])}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPermissions;
