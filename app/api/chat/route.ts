import { type NextRequest, NextResponse } from "next/server"

// Fallback responses for when no OpenAI API key is available
const fallbackResponses = {
  garage: [
    "Bạn có thể tìm garage gần nhất bằng cách sử dụng tính năng tìm kiếm trên trang chủ. Chúng tôi sẽ hiển thị các garage theo khoảng cách và đánh giá.",
    "Để tìm garage uy tín, hãy xem phần đánh giá và nhận xét của khách hàng trước đó. Garage 5 sao thường có chất lượng dịch vụ tốt nhất.",
    "Bạn có thể lọc garage theo loại dịch vụ như thay dầu, sửa phanh, hoặc cứu hộ khẩn cấp.",
  ],
  booking: [
    "Để đặt lịch hẹn, bạn chọn garage mong muốn, sau đó chọn dịch vụ và thời gian phù hợp. Hệ thống sẽ xác nhận lịch hẹn qua SMS.",
    "Bạn có thể đặt lịch trước 24h hoặc đặt lịch khẩn cấp. Garage sẽ xác nhận trong vòng 15 phút.",
    "Sau khi đặt lịch, bạn sẽ nhận được mã booking để theo dõi trạng thái dịch vụ.",
  ],
  emergency: [
    "Dịch vụ cứu hộ 24/7: Gọi hotline 1900 1234 để được hỗ trợ khẩn cấp. Chúng tôi sẽ điều xe cứu hộ đến trong 15-30 phút.",
    "Cứu hộ khẩn cấp bao gồm: xe chết máy, hết xăng, thủng lốp, tai nạn nhẹ. Phí cứu hộ từ 200.000đ tùy khoảng cách.",
    "Khi gọi cứu hộ, hãy cung cấp vị trí chính xác và mô tả tình trạng xe để chúng tôi chuẩn bị thiết bị phù hợp.",
  ],
  price: [
    "Bảng giá dịch vụ: Thay dầu từ 150.000đ, Sửa phanh từ 300.000đ, Cứu hộ từ 200.000đ. Giá có thể thay đổi tùy loại xe.",
    "Chúng tôi có chính sách giá minh bạch. Bạn sẽ được báo giá chi tiết trước khi thực hiện dịch vụ.",
    "Thanh toán linh hoạt: tiền mặt, chuyển khoản, hoặc ví điện tử. Có hóa đơn VAT cho doanh nghiệp.",
  ],
  time: [
    "Thời gian sửa chữa: Thay dầu 30 phút, Sửa phanh 1-2 tiếng, Bảo dưỡng tổng quát 2-4 tiếng tùy tình trạng xe.",
    "Garage hoạt động từ 7:00 - 19:00 hàng ngày. Dịch vụ cứu hộ 24/7 cả cuối tuần và ngày lễ.",
    "Bạn có thể theo dõi tiến độ sửa chữa real-time qua app hoặc SMS thông báo.",
  ],
  location: [
    "Chúng tôi có mạng lưới hơn 500 garage trên toàn quốc, tập trung tại TP.HCM, Hà Nội, Đà Nẵng và các tỉnh thành lớn.",
    "Sử dụng GPS để tìm garage gần nhất. Khoảng cách trung bình từ vị trí của bạn đến garage là 2-5km.",
    "Garage đối tác đều được kiểm định chất lượng và có bảo hiểm trách nhiệm nghề nghiệp.",
  ],
  review: [
    "Hệ thống đánh giá 5 sao giúp bạn chọn garage uy tín. Đánh giá dựa trên chất lượng dịch vụ, giá cả, và thái độ nhân viên.",
    "Bạn có thể xem nhận xét chi tiết từ khách hàng trước đó để đưa ra quyết định phù hợp.",
    "Sau khi sử dụng dịch vụ, hãy để lại đánh giá để giúp cộng đồng có thêm thông tin tham khảo.",
  ],
  warranty: [
    "Tất cả dịch vụ đều có bảo hành: Thay dầu 3 tháng, Sửa phanh 6 tháng, Sửa chữa lớn 1 năm.",
    "Bảo hành bao gồm linh kiện và công lao động. Nếu có vấn đề trong thời gian bảo hành, garage sẽ sửa miễn phí.",
    "Giữ hóa đơn và phiếu bảo hành để được hỗ trợ tốt nhất khi cần thiết.",
  ],
  greeting: [
    "Xin chào! Tôi là trợ lý ảo của XeCare. Tôi có thể giúp bạn tìm garage, đặt lịch hẹn, hoặc giải đáp thắc mắc về dịch vụ sửa xe.",
    "Chào bạn! Bạn cần hỗ trợ gì về dịch vụ garage hôm nay? Tôi có thể giúp tìm garage gần nhất hoặc tư vấn dịch vụ phù hợp.",
    "Hello! Tôi là chatbot của XeCare, sẵn sàng hỗ trợ 24/7. Bạn có câu hỏi gì về garage và dịch vụ sửa xe không?",
  ],
  thanks: [
    "Cảm ơn bạn đã sử dụng dịch vụ XeCare! Nếu có thêm câu hỏi, đừng ngại liên hệ nhé.",
    "Rất vui được hỗ trợ bạn! Chúc bạn lái xe an toàn và hẹn gặp lại.",
    "Cảm ơn bạn! Đừng quên đánh giá dịch vụ sau khi sử dụng để giúp cải thiện chất lượng nhé.",
  ],
}

function getSmartResponse(message: string): string {
  const msg = message.toLowerCase()

  // Greeting patterns
  if (msg.includes("xin chào") || msg.includes("chào") || msg.includes("hello") || msg.includes("hi")) {
    return fallbackResponses.greeting[Math.floor(Math.random() * fallbackResponses.greeting.length)]
  }

  // Thanks patterns
  if (msg.includes("cảm ơn") || msg.includes("thanks") || msg.includes("thank you")) {
    return fallbackResponses.thanks[Math.floor(Math.random() * fallbackResponses.thanks.length)]
  }

  // Garage search patterns
  if (msg.includes("tìm garage") || msg.includes("garage gần") || msg.includes("tìm kiếm") || msg.includes("ở đâu")) {
    return fallbackResponses.garage[Math.floor(Math.random() * fallbackResponses.garage.length)]
  }

  // Booking patterns
  if (msg.includes("đặt lịch") || msg.includes("booking") || msg.includes("hẹn") || msg.includes("đặt hẹn")) {
    return fallbackResponses.booking[Math.floor(Math.random() * fallbackResponses.booking.length)]
  }

  // Emergency patterns
  if (msg.includes("cứu hộ") || msg.includes("khẩn cấp") || msg.includes("emergency") || msg.includes("hotline")) {
    return fallbackResponses.emergency[Math.floor(Math.random() * fallbackResponses.emergency.length)]
  }

  // Price patterns
  if (
    msg.includes("giá") ||
    msg.includes("phí") ||
    msg.includes("chi phí") ||
    msg.includes("price") ||
    msg.includes("bao nhiêu")
  ) {
    return fallbackResponses.price[Math.floor(Math.random() * fallbackResponses.price.length)]
  }

  // Time patterns
  if (msg.includes("thời gian") || msg.includes("bao lâu") || msg.includes("mấy giờ") || msg.includes("time")) {
    return fallbackResponses.time[Math.floor(Math.random() * fallbackResponses.time.length)]
  }

  // Location patterns
  if (msg.includes("địa chỉ") || msg.includes("vị trí") || msg.includes("location") || msg.includes("chỗ nào")) {
    return fallbackResponses.location[Math.floor(Math.random() * fallbackResponses.location.length)]
  }

  // Review patterns
  if (msg.includes("đánh giá") || msg.includes("review") || msg.includes("nhận xét") || msg.includes("chất lượng")) {
    return fallbackResponses.review[Math.floor(Math.random() * fallbackResponses.review.length)]
  }

  // Warranty patterns
  if (msg.includes("bảo hành") || msg.includes("warranty") || msg.includes("bảo đảm")) {
    return fallbackResponses.warranty[Math.floor(Math.random() * fallbackResponses.warranty.length)]
  }

  // Default response
  return "Tôi hiểu bạn đang cần hỗ trợ về dịch vụ garage. Bạn có thể hỏi tôi về: tìm garage gần nhất, đặt lịch hẹn, cứu hộ khẩn cấp, bảng giá dịch vụ, thời gian sửa chữa, hoặc các thông tin khác về XeCare."
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (openaiApiKey) {
      // Use OpenAI API
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `Bạn là trợ lý ảo của XeCare - nền tảng tìm garage sửa xe uy tín tại Việt Nam. 
                Hãy trả lời bằng tiếng Việt, thân thiện và hữu ích. 
                Tập trung vào các chủ đề: tìm garage, đặt lịch hẹn, cứu hộ khẩn cấp, giá cả dịch vụ, bảo hành.
                Hotline cứu hộ: 1900 1234. Luôn khuyến khích người dùng sử dụng app XeCare.`,
              },
              {
                role: "user",
                content: message,
              },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        })

        if (!response.ok) {
          throw new Error("OpenAI API error")
        }

        const data = await response.json()
        const aiResponse = data.choices[0]?.message?.content || "Xin lỗi, tôi không thể trả lời lúc này."

        return NextResponse.json({
          response: aiResponse,
          mode: "ai",
        })
      } catch (error) {
        console.error("OpenAI API error:", error)
        // Fall back to smart responses
        const smartResponse = getSmartResponse(message)
        return NextResponse.json({
          response: smartResponse,
          mode: "smart",
        })
      }
    } else {
      // Use smart fallback responses
      const smartResponse = getSmartResponse(message)
      return NextResponse.json({
        response: smartResponse,
        mode: "smart",
      })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        response: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        mode: "error",
      },
      { status: 500 },
    )
  }
}
