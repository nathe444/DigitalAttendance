import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  UserPlus,
  UserMinus,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import {
  useAssignStaffMutation,
  useRevokeStaffMutation,
  useAssignOrganizationalSuperAdminMutation,
  useRevokeOrganizationalSuperAdminMutation,
} from "@/store/apis/staff/staffApi";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DialogMode = "assign" | "revoke" | "assignSuperAdmin" | "revokeSuperAdmin";

export default function Staff() {
  const [email, setEmail] = useState("");
  const [dialogMode, setDialogMode] = useState<DialogMode>("assign");
  const [open, setOpen] = useState(false);

  const [assignStaff, { isLoading: isAssigning, isSuccess: isAssignSuccess }] =
    useAssignStaffMutation();
  const [revokeStaff, { isLoading: isRevoking, isSuccess: isRevokeSuccess }] =
    useRevokeStaffMutation();
  const [
    assignSuperAdmin,
    { isLoading: isAssigningSuperAdmin, isSuccess: isAssignSuperAdminSuccess },
  ] = useAssignOrganizationalSuperAdminMutation();
  const [
    revokeSuperAdmin,
    { isLoading: isRevokingSuperAdmin, isSuccess: isRevokeSuperAdminSuccess },
  ] = useRevokeOrganizationalSuperAdminMutation();

  const isLoading =
    dialogMode === "assign"
      ? isAssigning
      : dialogMode === "revoke"
      ? isRevoking
      : dialogMode === "assignSuperAdmin"
      ? isAssigningSuperAdmin
      : isRevokingSuperAdmin;

  const isSuccess =
    dialogMode === "assign"
      ? isAssignSuccess
      : dialogMode === "revoke"
      ? isRevokeSuccess
      : dialogMode === "assignSuperAdmin"
      ? isAssignSuperAdminSuccess
      : isRevokeSuperAdminSuccess;

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setOpen(open);
      if (!open) {
        setEmail("");
      }
    }
  };

  const openDialog = (mode: DialogMode) => {
    setDialogMode(mode);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      if (dialogMode === "assign") {
        try {
          await assignStaff({ email }).unwrap();
          toast.success("Staff role assigned successfully");
        } catch (error: any) {
          console.error("Failed to assign staff role:", error);
          toast.error(
            error.data?.error ||
              error.data?.detail ||
              "Failed to assign staff role"
          );
        }
      } else if (dialogMode === "revoke") {
        try {
          await revokeStaff({ email }).unwrap();
          toast.success("Staff role revoked successfully");
        } catch (error: any) {
          console.error("Failed to revoke staff role:", error);
          toast.error(
            error.data?.error ||
              error.data?.detail ||
              "Failed to revoke staff role"
          );
        }
      } else if (dialogMode === "assignSuperAdmin") {
        try {
          await assignSuperAdmin({ email }).unwrap();
          toast.success("Super Admin role assigned successfully");
        } catch (error: any) {
          console.error("Failed to assign Super Admin role:", error);
          toast.error(
            error.data?.error ||
              error.data?.detail ||
              "Failed to assign Super Admin role"
          );
        }
      } else {
        try {
          await revokeSuperAdmin({ email }).unwrap();
          toast.success("Super Admin role revoked successfully");
        } catch (error: any) {
          console.error("Failed to revoke Super Admin role:", error);
          toast.error(
            error.data?.error ||
              error.data?.detail ||
              "Failed to revoke Super Admin role"
          );
        }
      }

      setEmail("");
      setTimeout(() => setOpen(false), 1500);
    } catch (error) {
      console.error(`Failed to ${dialogMode} role:`, error);
      toast.error(
        `Failed to ${
          dialogMode === "assign" || dialogMode === "assignSuperAdmin"
            ? "assign"
            : "revoke"
        } role`
      );
    }
  };

  const getDialogTitle = () => {
    switch (dialogMode) {
      case "assign":
        return "Assign Staff Role";
      case "revoke":
        return "Revoke Staff Role";
      case "assignSuperAdmin":
        return "Assign Super Admin Role";
      case "revokeSuperAdmin":
        return "Revoke Super Admin Role";
    }
  };

  const getDialogDescription = () => {
    switch (dialogMode) {
      case "assign":
        return "Enter the email address of the user you want to assign as staff.";
      case "revoke":
        return "Enter the email address of the staff member you want to revoke privileges from.";
      case "assignSuperAdmin":
        return "Enter the email address of the user you want to assign as Organizational Super Admin.";
      case "revokeSuperAdmin":
        return "Enter the email address of the Super Admin you want to revoke privileges from.";
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      switch (dialogMode) {
        case "assign":
          return "Assigning...";
        case "revoke":
          return "Revoking...";
        case "assignSuperAdmin":
          return "Assigning Super Admin...";
        case "revokeSuperAdmin":
          return "Revoking Super Admin...";
      }
    } else if (isSuccess) {
      switch (dialogMode) {
        case "assign":
          return "Assigned!";
        case "revoke":
          return "Revoked!";
        case "assignSuperAdmin":
          return "Super Admin Assigned!";
        case "revokeSuperAdmin":
          return "Super Admin Revoked!";
      }
    } else {
      switch (dialogMode) {
        case "assign":
          return "Assign Staff";
        case "revoke":
          return "Revoke Staff";
        case "assignSuperAdmin":
          return "Assign Super Admin";
        case "revokeSuperAdmin":
          return "Revoke Super Admin";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6 text-center">
          Staff
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Staff Role Cards */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{
              y: -2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800">
                Assign Staff Role
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Grant staff privileges to a user
              </p>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">
                Assign staff role to a user by their email address.
              </p>
              <Button
                onClick={() => openDialog("assign")}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                variant="outline"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Staff Role
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{
              y: -2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800">
                Revoke Staff Role
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Remove staff privileges from a user
              </p>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">
                Revoke staff role from a user by their email address.
              </p>
              <Button
                onClick={() => openDialog("revoke")}
                className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                variant="outline"
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Revoke Staff Role
              </Button>
            </div>
          </motion.div>

          {/* Super Admin Role Cards */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{
              y: -2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800">
                Assign Super Admin Role
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Grant organizational super admin privileges
              </p>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">
                Assign super admin role to a user by their email address. Super
                admins have full control over the organization and all its
                settings.
              </p>
              <Button
                onClick={() => openDialog("assignSuperAdmin")}
                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200"
                variant="outline"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Assign Super Admin
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            whileHover={{
              y: -2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-800">
                Revoke Super Admin Role
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Remove organizational super admin privileges
              </p>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4">
                Revoke super admin role from a user by their email address. This
                will remove their ability to manage organization-wide settings.
              </p>
              <Button
                onClick={() => openDialog("revokeSuperAdmin")}
                className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200"
                variant="outline"
              >
                <ShieldX className="mr-2 h-4 w-4" />
                Revoke Super Admin
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Role Dialog using shadcn/ui */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-white p-0 rounded-lg shadow-lg border border-gray-200">
          <DialogHeader className="p-5 border-b border-gray-100 bg-gray-50">
            <DialogTitle className="text-lg font-medium text-gray-800">
              {getDialogTitle()}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="staff-email"
                className="text-gray-700 text-sm font-medium"
              >
                Email Address
              </Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                required
                disabled={isLoading || isSuccess}
              />
            </div>

            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading || isSuccess}
                className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`min-w-[120px] ${
                  dialogMode.includes("revoke")
                    ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                    : dialogMode.includes("Super")
                    ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                }`}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {getButtonText()}
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {getButtonText()}
                  </>
                ) : (
                  <>{getButtonText()}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
