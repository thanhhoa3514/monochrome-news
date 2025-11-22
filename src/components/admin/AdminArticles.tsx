import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockNewsData } from '@/data/mockNewsData';

interface AdminArticlesProps {
    onAddArticle: () => void;
}

const AdminArticles: React.FC<AdminArticlesProps> = ({ onAddArticle }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = mockNewsData.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold font-serif">Articles Management</h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto"
                    />
                    <Button
                        className="shrink-0 bg-primary text-primary-foreground"
                        onClick={onAddArticle}
                    >
                        <Plus className="h-4 w-4 mr-1" /> New Article
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredArticles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium">{article.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{article.category}</Badge>
                                    </TableCell>
                                    <TableCell>{article.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => navigate(`/news/${article.id}`)}>
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-destructive">
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminArticles;
