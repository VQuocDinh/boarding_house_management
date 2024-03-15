import React from "react";
import { Page, Font , Text, Image, Document, StyleSheet } from "@react-pdf/renderer";
// import LebronStretch from "../photos/lebron_transparent.png";

Font.register({
    family: "Roboto",
    src:
      "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
  });

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "Roboto"
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Roboto"
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Roboto",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
    fontFamily: "Roboto"
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Roboto",
    color: "black",
    fontWeight : 800
  },
  pageNumber: {
    position: "absolute",
    fontFamily: "Roboto",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const PDFFileRecieve = (item) => {
    console.log(item);
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>PHIẾU CHI</Text>
        <Text style={styles.text}>
        {`              Ngày ${item?.time?.split("/")[0]} tháng ${item?.time?.split("/")[1]} năm ${item?.time?.split("/")[2]}
                
            Họ và tên người nhận tiền :  ${item.receiver}
            Lý do chi :  ${item.reason}                 
            Số  tiền : ${item.price} vnđ

                                Ngày ${item?.time?.split("/")[0]} tháng ${item?.time?.split("/")[1]} năm ${item?.time?.split("/")[2]}
            Người lập phiếu               Người nhận tiền         
            (Ký rõ họ tên)                (Ký rõ họ tên)       `

        }
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
      hm cái của nợ này 
    </Document>
  );
};

export default PDFFileRecieve;