
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddEditUserModal from "@/components/modals/AddEditUserModal";
import AddEditArticleModal from "@/components/modals/AddEditArticleModal";
import DeleteModal from "@/components/modals/DeleteModal";
import { toast } from "@/hooks/use-toast";
import { User } from "@/data/mockUserData";

const ModalDemo = () => {
  // State for controlling modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Sample data
  const sampleUser: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "editor",
    status: "active",
    lastLogin: "2025-05-20",
    joinDate: "2024-01-15",
    avatar: "",
  };

  // Handler functions
  const handleAddUser = (userData: Partial<User>) => {
    toast({
      title: "User Added",
      description: `New user ${userData.name} has been created successfully.`,
    });
  };

  const handleEditUser = (userData: Partial<User>) => {
    toast({
      title: "User Updated",
      description: `User ${userData.name} has been updated successfully.`,
    });
  };

  const handleAddArticle = (articleData: { title?: string }) => {
    toast({
      title: "Article Added",
      description: `New article "${articleData.title}" has been created successfully.`,
    });
  };

  const handleDeleteItem = () => {
    toast({
      title: "Item Deleted",
      description: "The item has been deleted successfully.",
      variant: "destructive",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Modal Components Demo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-xl font-medium">User Management</h3>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setIsAddUserModalOpen(true)}>Add New User</Button>
            <Button onClick={() => setIsEditUserModalOpen(true)}>Edit Existing User</Button>
          </div>
        </div>
        
        <div className="space-y-4 p-4 border rounded-md">
          <h3 className="text-xl font-medium">Content Management</h3>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setIsAddArticleModalOpen(true)}>Add New Article</Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Item
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEditUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />
      
      <AddEditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        onSubmit={handleEditUser}
        user={sampleUser}
      />
      
      <AddEditArticleModal
        isOpen={isAddArticleModalOpen}
        onClose={() => setIsAddArticleModalOpen(false)}
        onSubmit={handleAddArticle}
      />
      
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteItem}
        itemName="Selected Item"
      />
    </div>
  );
};

export default ModalDemo;
