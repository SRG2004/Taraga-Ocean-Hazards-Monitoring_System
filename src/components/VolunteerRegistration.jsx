import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox'; // Assuming you have a Checkbox component
import { AlertCircle, CheckCircle } from 'lucide-react';

export const VolunteerRegistration = () => {
    const [formData, setFormData] = useState({
        skills: [],
        availability: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (skill) => {
        setFormData(prev => {
            const newSkills = prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill];
            return { ...prev, skills: newSkills };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const postData = {
            skills: formData.skills,
            availability: formData.availability,
            emergencyContact: {
                name: formData.emergencyContactName,
                phone: formData.emergencyContactPhone
            }
        };

        try {
            const response = await fetch('/api/volunteers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to register as volunteer');
            }

            const result = await response.json();
            setSuccess('Successfully registered as a volunteer!');
            console.log(result);
            // Reset form
            setFormData({
                skills: [],
                availability: '',
                emergencyContactName: '',
                emergencyContactPhone: '',
            });

        } catch (err) {
             if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const availableSkills = ['first-aid', 'search-and-rescue', 'communication', 'logistics', 'translation'];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Volunteer Registration</CardTitle>
                <CardDescription>Join our team of volunteers and make a difference.</CardDescription>
            </CardHeader>
            <CardContent>
                 {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>{success}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="space-y-2">
                        <Label>Skills</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {availableSkills.map(skill => (
                                <div key={skill} className="flex items-center gap-2">
                                    <Checkbox 
                                        id={skill} 
                                        checked={formData.skills.includes(skill)}
                                        onCheckedChange={() => handleCheckboxChange(skill)}
                                    />
                                    <Label htmlFor={skill} className="capitalize">{skill.replace('-', ' ')}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="availability">Availability</Label>
                        <Input id="availability" name="availability" placeholder="e.g., Weekends, Evenings" value={formData.availability} onChange={handleInputChange}/>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                            <Input id="emergencyContactName" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                            <Input id="emergencyContactPhone" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange}/>
                        </div>
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? 'Submitting...' : 'Register as Volunteer'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};