export const scrollToMessage = (messageRefs: any, messageId: string) => {
    const messageRef = messageRefs.current[messageId];
    if (messageRef?.current) {
      messageRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "center"
      });
      
      // Добавляем визуальный эффект выделения
      messageRef.current.classList.add('message-highlighted');
      setTimeout(() => {
        messageRef.current?.classList.remove('message-highlighted');
      }, 2000);
    }
  };