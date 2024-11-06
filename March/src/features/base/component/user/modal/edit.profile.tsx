import React, { useEffect, useState } from "react";
import { Gender } from "../../../../../entities/gender";
import { showToast } from "../../../../../utils/toast";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
    InputLabel, MenuItem, Select, TextField, createTheme, ThemeProvider, SelectChangeEvent
} from "@mui/material";
import { apiV1 } from "../../../../../libs/api";

interface User {
    id: number;
    name: string;
    phone: number;
    photo: string;
    gender: Gender;
    address: string;
    user: {
        email: string
    }
}

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    userData: User | undefined;
    onSave: (updatedData: User) => void;
}

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ff4c4c",
        },
        background: {
            default: "#1c1c1c",
            paper: "black",
        },
        text: {
            primary: "#ffffff",
        },
    },
});

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose, userData, onSave }) => {
    const [formData, setFormData] = useState<User | undefined>(userData);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (userData) {
            setFormData(userData);
            setPreviewImage(userData.photo);
        }
    }, [userData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? {
            ...prev,
            [name]: value
        } : undefined);
    };

    const handleGenderChange = (e: SelectChangeEvent<Gender>) => {
        setFormData(prev => prev ? {
            ...prev,
            gender: e.target.value as Gender
        } : undefined);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => prev ? {
                ...prev,
                photo: file.name
            } : undefined);
            setImageFile(file)
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const saveProfile = async () => {
        if (!formData) return;

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("phone", String(formData.phone));
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("address", formData.address);

        if (imageFile) {
            formDataToSend.append("photo", imageFile);
        }

        try {
            const response = await apiV1.put("/profile/update", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });


            if (response.status === 200) {
                showToast.success("Profile updated successfully");

                const updatedData = {
                    ...response.data.result,
                    user: response.data.result.user,

                };

                console.log("gambar cuy", updatedData);

                onSave(updatedData);
                onClose();
            }
        } catch (error) {
            showToast.error("Failed to update profile");
            console.error("Error updating profile:", error);
        }
    };





    if (!formData) return null;

    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        margin="dense"
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        type="number"
                        fullWidth
                        margin="dense"
                        onChange={handleChange}
                        value={formData.phone}
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleGenderChange}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Address"
                        name="address"
                        fullWidth
                        multiline
                        rows={3}
                        margin="dense"
                        onChange={handleChange}
                        value={formData.address}
                    />

                    <FormControl fullWidth margin="dense">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ display: "none" }}
                            id="photo-upload"
                        />
                        <label htmlFor="photo-upload">
                            <Button variant="contained" color="primary" component="span">
                                Upload New Photo
                            </Button>
                        </label>
                    </FormControl>

                    {previewImage && (
                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                            <img src={previewImage} alt="Preview" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }} />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={saveProfile} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default EditProfileModal;
