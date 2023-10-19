import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';

const { Option } = Select;



const FolderStructure: React.FC = () => {
  const [folders, setFolders] = useState<any[]>([]);
  const [newFolderName, setNewFolderName] = useState<string>('');






  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };





  // Fetch folder structure from the backend on component load
  useEffect(() => {
    axios.get('https://htl-backend.onrender.com/api/folders').then((response) => {
      setFolders(response.data);
    });
  }, []);

  // Function to create a new folder
  const createFolder = () => {
    axios
      .post('https://htl-backend.onrender.com/api/folders', { name: newFolderName })
      .then((response) => {
        setFolders([...folders, response.data]);
        setNewFolderName('');
      });
  };

  // Function to delete a folder by its ID
  const deleteFolder = (folderId: string) => {
    if (folderId === 'root') {
      alert('The root folder cannot be deleted.');
      return;
    }
    if (window.confirm("Are you sure you want to delete this folder?"))
      axios
        .delete(`https://htl-backend.onrender.com/api/folders/${folderId}`)
        .then(() => {
          const updatedFolders = folders.filter((folder) => folder._id !== folderId);
          setFolders(updatedFolders);
        });
  };

  return (
    <div className="py-12 bg-slate-800 min-h-screen text-white font-semibold">
      <h1>Folder Structure Viewer</h1>


      <div className="items-center justify-center ">
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          New folder
        </Button>
      </div>
      <ul>
        {folders.map((folder) => (
          <Folder
            key={folder._id}
            folder={folder}
            deleteFolder={deleteFolder}
          />
        ))}
      </ul>



      <Drawer
        title="Create a new folder"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onClose} type="primary" >
              <button onClick={createFolder} className="bg-blue-500 border-none text-white">
                Create
              </button>

            </Button>
          </Space>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <input

                type="text"
                placeholder="Enter your new folder name"
                value={newFolderName}
                required
                onChange={(e) => setNewFolderName(e.target.value)}
                className="py-2 "
              />
              {/* <Form.Item
                                name="name"
                                label="Name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                rules={[{ required: true, message: 'Please enter user name' }]}
                            >
                                <Input placeholder="Please enter folder name" />
                            </Form.Item> */}
            </Col>
          </Row>
        </Form>
      </Drawer>

    </div>
  );
};

export default FolderStructure;

interface FolderProps {
  folder: any;
  deleteFolder: (folderId: string) => void;
}

const Folder: React.FC<FolderProps> = ({ folder, deleteFolder }) => (
  <div className="pt-4">
    {folder.name}{' '}
    <button onClick={() => deleteFolder(folder._id)} className='mx-2'>Delete</button>
    {folder.subfolders && (
      <ul>
        {folder.subfolders.map((subfolder: any) => (
          <Folder key={subfolder._id} folder={subfolder} deleteFolder={deleteFolder} />
        ))}
      </ul>
    )}
  </div>
);
