
import React, { useState } from 'react';
import { Shield, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { mockPermissions, mockRoleDefinitions } from '@/data/mockPermissionsData';
import { UserRole } from '@/types/permissions';

const AdminPermissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);
  const [permissionsByRole, setPermissionsByRole] = useState(() => {
    const initialState: Record<UserRole, string[]> = {
      admin: mockRoleDefinitions.find(r => r.name === 'admin')?.permissions || [],
      editor: mockRoleDefinitions.find(r => r.name === 'editor')?.permissions || [],
      viewer: mockRoleDefinitions.find(r => r.name === 'viewer')?.permissions || []
    };
    return initialState;
  });

  // Filter permissions based on search term and role filter
  const filteredPermissions = mockPermissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || permission.roles.includes(roleFilter);
    
    return matchesSearch && matchesRole;
  });

  const handleTogglePermission = (role: UserRole, permissionId: string) => {
    setPermissionsByRole(prev => {
      const newPermissions = { ...prev };
      
      if (newPermissions[role].includes(permissionId)) {
        // Remove permission if it exists
        newPermissions[role] = newPermissions[role].filter(id => id !== permissionId);
      } else {
        // Add permission if it doesn't exist
        newPermissions[role] = [...newPermissions[role], permissionId];
      }
      
      return newPermissions;
    });
  };

  const handleSaveRoleChanges = (role: UserRole) => {
    toast({
      title: "Role Updated",
      description: `Permissions for ${role} role have been updated.`,
    });
    
    setEditingRole(null);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary text-primary-foreground">{role}</Badge>;
      case 'editor':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">{role}</Badge>;
      case 'viewer':
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold font-serif">Permissions Management</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-full sm:w-auto"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Role Definitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockRoleDefinitions.map(role => (
          <Card key={role.name} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2 flex-wrap">
                    {role.name === 'admin' && <Shield className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />}
                    {role.name === 'editor' && <Users className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />}
                    {role.name === 'viewer' && <Settings className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />}
                    {getRoleBadge(role.name)}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  {editingRole === role.name ? (
                    <Button 
                      onClick={() => handleSaveRoleChanges(role.name)}
                      className="bg-actionRed hover:bg-actionRed-hover h-8 text-xs sm:text-sm w-full"
                      size="sm"
                    >
                      Save Changes
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingRole(role.name)}
                      className="h-8 text-xs sm:text-sm w-full"
                      size="sm"
                    >
                      Edit Permissions
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{role.description}</p>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-muted-foreground">Permissions</span>
                  <Badge variant="secondary" className="text-xs sm:text-sm font-semibold">
                    {permissionsByRole[role.name].length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Permissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Permission</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                  <TableHead className="text-center">Editor</TableHead>
                  <TableHead className="text-center">Viewer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissionsByRole.admin.includes(permission.id)}
                          disabled={editingRole !== 'admin'}
                          onCheckedChange={() => {
                            if (editingRole === 'admin') {
                              handleTogglePermission('admin', permission.id);
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissionsByRole.editor.includes(permission.id)}
                          disabled={editingRole !== 'editor'}
                          onCheckedChange={() => {
                            if (editingRole === 'editor') {
                              handleTogglePermission('editor', permission.id);
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={permissionsByRole.viewer.includes(permission.id)}
                          disabled={editingRole !== 'viewer'}
                          onCheckedChange={() => {
                            if (editingRole === 'viewer') {
                              handleTogglePermission('viewer', permission.id);
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPermissions;
