import React from 'react';
import { useSTLStore } from '@/store/stlStore';
import Asset from './Asset';

const Models = () => {
  const { models, selectedAssetId, setSelectedAssetId } = useSTLStore();

  const handleSelect = (id) => {
    setSelectedAssetId(id);
  };

  return (
    <group>
      {models.map((model) => (
        <Asset
          key={model.id}
          asset={model}
          isSelected={model.id === selectedAssetId}
          onSelect={() => handleSelect(model.id)}
        />
      ))}
    </group>
  );
};

export default Models;