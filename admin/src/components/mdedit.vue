<template>
    <div class="index-page" v-loading="isLoading">
        <div id="vditor" class="vditor" style="height: 650px; width: auto;" />
    </div>
</template>

<script>
import Vditor from "vditor";
import "vditor/dist/index.css";
//   import { getToken } from '@/utils/auth'
export default {
    name: "Mdedit",
    props: {
        // content: ""
    },
    data() {
        return {
            isLoading: true,
            isMobile: window.innerWidth <= 960,
            vditor: null
        };
    },
    created() {},
    components: {},
    // computed: {
    //     vditorClass: function() {
    //         return {
    //             height: this.height + "px"
    //         };
    //     }
    // },
    mounted() {
        this.initVditor();
    },
    methods: {
        initVditor() {
            const options = {
                height: 660,
                icon: "material",
                // theme: "dark",
                IHljs: {
                    lineNumber: true,
                    style: "monokai"
                },
                toolbarConfig: {
                    pin: true
                },
                cache: {
                    enable: true
                },
                outline: true
                // after: () => {
                //     this.vditor.setValue(this.content);
                // }
            };
            this.vditor = new Vditor("vditor", options);
            // return vditor
        },
        //获取data
        getData() {
            return this.vditor.getValue();
        },
        //获取渲染文本
        getHTML() {
            return this.vditor.getHTML();
        },
        setData(content) {
            this.vditor.setValue(this.vditor.html2md(content));
        },

        settheme() {
            this.vditor = new Vditor("vditor", {
                height: 660,
                icon: "material",
                theme: "dark",
                IHljs: {
                    lineNumber: true,
                    style: "monokai"
                },
                toolbarConfig: {
                    pin: true
                },
                cache: {
                    enable: true
                },
                outline: true
                // after: () => {
                //     this.vditor.setValue(this.content);
                // }
            });
        }
        // setData: function(data) {
        //     // console.log("将html转", this.vditor.html2md(data))
        //     var that = this;
        //     this.$nextTick(() => {
        //         //DOM现在更新了
        //         that.initVditor();

        //         let markdownText = that.$commonUtil.htmlToMarkdown(data);
        //         console.log("转换前", data);
        //         console.log("得到的html", markdownText);
        //         localStorage.setItem("vditorvditor", markdownText);
        //     });
        // }
    }
};
</script>

<style>
.vditor-panel {
    line-height: 0px;
}
.index-page {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
}
.vditor {
    width: 100%;
    /*height: calc(100vh - 100px);*/
    top: 20px;
    /*margin: 20px auto;*/
    text-align: left;
}
.vditor-reset {
    font-size: 14px;
}
.vditor-textarea {
    font-size: 14px;
    height: 100% !important;
}
</style>
