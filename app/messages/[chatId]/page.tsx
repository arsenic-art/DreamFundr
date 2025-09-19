import React from 'react'

const dms = async ({params} : { params: Promise<{ chatId: string }> }) => {
  const { chatId } = await params;
  return (
    <div>
      {chatId}
      <div>
        
      </div>
    </div>
  )
}

export default dms
