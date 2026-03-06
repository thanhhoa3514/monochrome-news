import React, { useState, useEffect } from "react";
import FormModal from "./FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { clientUserService } from "@/lib/client";
import { UserListItem, CreateUserInput, UpdateUserInput } from "@/types/user";
import { Role } from "@/types/permissions";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

type AddEditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserListItem;
  roles: Role[];
}

type FormData = {
  name: string;
  email: string;
  password: string;
  selectedRoles: number[];
}

const AddEditUserModal = ({ isOpen, onClose, onSuccess, user, roles }: AddEditUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    selectedRoles: [],
  });

  // Set form data when editing or opening
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        selectedRoles: user.roles.map(r => r.id),
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        selectedRoles: [],
      });
    }
  }, [user, isOpen]);

  const handleChange = (field: keyof FormData, value: string | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRole = (roleId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleId)
        ? prev.selectedRoles.filter(id => id !== roleId)
        : [...prev.selectedRoles, roleId]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!user && !formData.password) {
      toast({
        title: "Validation Error",
        description: "Password is required for new users",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (user) {
        // Update existing user
        const updateData: UpdateUserInput = {
          name: formData.name,
          email: formData.email,
          role_ids: formData.selectedRoles,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await clientUserService.updateUser(user.id, updateData);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        // Create new user
        const createData: CreateUserInput = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role_ids: formData.selectedRoles,
        };
        await clientUserService.createUser(createData);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save user:', error);
      toast({
        title: "Error",
        description: "Failed to save user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!user;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditing ? "Edit User" : "Add New User"}
      description={isEditing ? "Update user information" : "Create a new user"}
      submitText={isEditing ? "Update" : "Create"}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password {isEditing ? "(leave blank to keep current)" : "*"}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder={isEditing ? "Enter new password (optional)" : "Enter password"}
            required={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label>Roles *</Label>
          <div className="space-y-2 border rounded-md p-3 max-h-40 overflow-y-auto">
            {roles.map(role => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={formData.selectedRoles.includes(role.id)}
                  onCheckedChange={() => toggleRole(role.id)}
                />
                <Label
                  htmlFor={`role-${role.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {role.name}
                  {role.description && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({role.description})
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default AddEditUserModal;
