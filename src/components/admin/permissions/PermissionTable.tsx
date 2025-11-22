import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Role, Permission } from '@/services/permissionService';
import React from 'react';

interface PermissionTableProps {
    roles: Role[];
    permissions: Permission[];
    localPermissions: Record<number, number[]>;
    hasChanges: Record<number, boolean>;
    searchTerm: string;
    filteredCategories: string[];
    groupedPermissions: Record<string, Permission[]>;
    handleTogglePermission: (roleId: number, permissionId: number) => void;
}

const PermissionTable = ({
    roles,
    permissions,
    localPermissions,
    hasChanges,
    searchTerm,
    filteredCategories,
    groupedPermissions,
    handleTogglePermission
}: PermissionTableProps) => {
    return (
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
                        {filteredCategories.map(category => (
                            <React.Fragment key={category}>
                                {/* Category Header */}
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableCell colSpan={roles.length + 1} className="font-semibold py-2">
                                        {category} Management
                                    </TableCell>
                                </TableRow>

                                {/* Permissions in Category */}
                                {groupedPermissions[category]
                                    .filter(p =>
                                        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map(permission => (
                                        <TableRow key={permission.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
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
                                    ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default PermissionTable;